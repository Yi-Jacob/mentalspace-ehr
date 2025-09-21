import React, { useState, useEffect } from 'react';
import { CheckSquare, User, Users, Calendar, FileText, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import PageLayout from '../../components/basic/PageLayout';
import PageHeader from '../../components/basic/PageHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/basic/tabs';
import { Table, TableColumn } from '../../components/basic/table';
import { Badge } from '../../components/basic/badge';
import { Button } from '../../components/basic/button';
import { todoService } from '../../services/todoService';
import { 
  TodoItem, 
  AccountTodoItem, 
  PatientTodoItem, 
  AppointmentTodoItem, 
  NoteTodoItem,
  TodoStats,
  TodoPriority,
  TodoStatus 
} from '../../types/todoTypes';

const TodoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TodoStats | null>(null);
  const [accountTodos, setAccountTodos] = useState<AccountTodoItem[]>([]);
  const [patientTodos, setPatientTodos] = useState<PatientTodoItem[]>([]);
  const [appointmentTodos, setAppointmentTodos] = useState<AppointmentTodoItem[]>([]);
  const [noteTodos, setNoteTodos] = useState<NoteTodoItem[]>([]);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [statsData, accountData, patientData, appointmentData, noteData] = await Promise.all([
        todoService.getTodoStats(),
        todoService.getAccountTodos(),
        todoService.getPatientTodos(),
        todoService.getAppointmentTodos(),
        todoService.getNoteTodos(),
      ]);

      setStats(statsData);
      setAccountTodos(accountData);
      setPatientTodos(patientData);
      setAppointmentTodos(appointmentData);
      setNoteTodos(noteData);
    } catch (error) {
      console.error('Error loading todo data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority: TodoPriority) => {
    const variants = {
      low: 'secondary',
      medium: 'default',
      high: 'destructive',
      urgent: 'destructive'
    } as const;

    return (
      <Badge variant={variants[priority]} className="text-xs">
        {priority.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: TodoStatus) => {
    const variants = {
      pending: 'secondary',
      in_progress: 'default',
      completed: 'default',
      cancelled: 'outline'
    } as const;

    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };

    return (
      <Badge variant={variants[status]} className={`text-xs ${colors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </Badge>
    );
  };

  const handleMarkComplete = async (todoId: string) => {
    try {
      await todoService.markTodoComplete(todoId);
      await loadAllData(); // Reload data
    } catch (error) {
      console.error('Error marking todo complete:', error);
    }
  };

  // Account Todos Table
  const accountColumns: TableColumn<AccountTodoItem>[] = [
    {
      key: 'userName',
      header: 'User Name',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{item.userName}</span>
          <Badge variant="outline" className="text-xs">
            {item.userType}
          </Badge>
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.userName
    },
    {
      key: 'missingFields',
      header: 'Missing Information',
      accessor: (item) => (
        <div className="space-y-1">
          {item.missingFields.map((field, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {field}
            </Badge>
          ))}
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.missingFields.join(' ')
    },
    {
      key: 'priority',
      header: 'Priority',
      accessor: (item) => getPriorityBadge(item.priority),
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => getStatusBadge(item.status),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleMarkComplete(item.id)}
          disabled={item.status === 'completed'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )
    }
  ];

  // Patient Todos Table
  const patientColumns: TableColumn<PatientTodoItem>[] = [
    {
      key: 'clientName',
      header: 'Patient Name',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{item.clientName}</span>
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.clientName
    },
    {
      key: 'missingFields',
      header: 'Missing Information',
      accessor: (item) => (
        <div className="space-y-1">
          {item.missingFields.map((field, index) => (
            <Badge key={index} variant="outline" className="text-xs mr-1">
              {field}
            </Badge>
          ))}
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.missingFields.join(' ')
    },
    {
      key: 'assignedClinician',
      header: 'Assigned Clinician',
      accessor: (item) => item.assignedClinicianName || 'Unassigned',
      searchable: true,
      searchValue: (item) => item.assignedClinicianName || ''
    },
    {
      key: 'priority',
      header: 'Priority',
      accessor: (item) => getPriorityBadge(item.priority),
      sortable: true
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => getStatusBadge(item.status),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleMarkComplete(item.id)}
          disabled={item.status === 'completed'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )
    }
  ];

  // Appointment Todos Table
  const appointmentColumns: TableColumn<AppointmentTodoItem>[] = [
    {
      key: 'clientName',
      header: 'Patient',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{item.clientName}</span>
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.clientName
    },
    {
      key: 'appointmentDate',
      header: 'Date & Time',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(item.appointmentDate).toLocaleDateString()}</span>
          <span className="text-gray-500">
            {new Date(item.appointmentDate).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'appointmentType',
      header: 'Type',
      accessor: (item) => (
        <Badge variant="outline" className="text-xs">
          {item.appointmentType}
        </Badge>
      ),
      searchable: true,
      searchValue: (item) => item.appointmentType
    },
    {
      key: 'providerName',
      header: 'Provider',
      accessor: (item) => item.providerName,
      searchable: true,
      searchValue: (item) => item.providerName
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (item) => getStatusBadge(item.status as TodoStatus),
      sortable: true
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleMarkComplete(item.id)}
          disabled={item.status === 'completed'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )
    }
  ];

  // Note Todos Table
  const noteColumns: TableColumn<NoteTodoItem>[] = [
    {
      key: 'clientName',
      header: 'Patient',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{item.clientName}</span>
        </div>
      ),
      searchable: true,
      searchValue: (item) => item.clientName
    },
    {
      key: 'sessionDate',
      header: 'Session Date',
      accessor: (item) => (
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span>{new Date(item.sessionDate).toLocaleDateString()}</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'noteType',
      header: 'Note Type',
      accessor: (item) => (
        <Badge variant="outline" className="text-xs">
          {item.noteType}
        </Badge>
      ),
      searchable: true,
      searchValue: (item) => item.noteType
    },
    {
      key: 'noteStatus',
      header: 'Note Status',
      accessor: (item) => getStatusBadge(item.noteStatus as TodoStatus),
      sortable: true
    },
    {
      key: 'daysOverdue',
      header: 'Days Overdue',
      accessor: (item) => item.daysOverdue ? (
        <div className="flex items-center space-x-1">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-red-600 font-medium">{item.daysOverdue}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-green-500" />
          <span className="text-green-600">On time</span>
        </div>
      ),
      sortable: true
    },
    {
      key: 'providerName',
      header: 'Provider',
      accessor: (item) => item.providerName,
      searchable: true,
      searchValue: (item) => item.providerName
    },
    {
      key: 'actions',
      header: 'Actions',
      accessor: (item) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleMarkComplete(item.id)}
          disabled={item.status === 'completed'}
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Complete
        </Button>
      )
    }
  ];

  const getTabBadge = (count: number) => (
    <Badge variant="secondary" className="ml-2">
      {count}
    </Badge>
  );

  return (
    <PageLayout>
      <PageHeader
        icon={CheckSquare}
        title="To-Do List"
        description="Manage your tasks and track important items that need attention"
        badge={stats && (
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {stats.total} Total
            </Badge>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {stats.pending} Pending
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700">
              {stats.overdue} Overdue
            </Badge>
          </div>
        )}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Account
            {getTabBadge(accountTodos.length)}
          </TabsTrigger>
          <TabsTrigger value="patients" className="flex items-center">
            <Users className="h-4 w-4 mr-2" />
            Patients
            {getTabBadge(patientTodos.length)}
          </TabsTrigger>
          <TabsTrigger value="appointments" className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Appointments
            {getTabBadge(appointmentTodos.length)}
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            Notes
            {getTabBadge(noteTodos.length)}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="mt-6">
          <Table
            data={accountTodos}
            columns={accountColumns}
            loading={loading}
            emptyMessage="No account-related tasks found"
            searchable={true}
            pagination={true}
          />
        </TabsContent>

        <TabsContent value="patients" className="mt-6">
          <Table
            data={patientTodos}
            columns={patientColumns}
            loading={loading}
            emptyMessage="No patient-related tasks found"
            searchable={true}
            pagination={true}
          />
        </TabsContent>

        <TabsContent value="appointments" className="mt-6">
          <Table
            data={appointmentTodos}
            columns={appointmentColumns}
            loading={loading}
            emptyMessage="No appointment-related tasks found"
            searchable={true}
            pagination={true}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Table
            data={noteTodos}
            columns={noteColumns}
            loading={loading}
            emptyMessage="No note-related tasks found"
            searchable={true}
            pagination={true}
          />
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default TodoPage;
