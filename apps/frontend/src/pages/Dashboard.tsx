
import React, { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard,
  CheckSquare,
  User,
  Users,
  Calendar,
  FileText,
  Clock,
  CheckCircle,
  Video,
  AlertTriangle,
  Plus
} from 'lucide-react';
import PageLayout from '@/components/basic/PageLayout';
import PageHeader from '@/components/basic/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/basic/card';
import { Badge } from '@/components/basic/badge';
import { Button } from '@/components/basic/button';
import { todoService } from '@/services/todoService';
import { useAuth } from '@/hooks/useAuth';
import { 
  AccountTodoItem, 
  PatientTodoItem, 
  AppointmentTodoItem, 
  NoteTodoItem,
  TodoPriority
} from '@/types/todoTypes';

interface DashboardStats {
  overdueTodos: number;
  accountTodos: number;
  patientTodos: number;
  appointmentTodos: number;
  noteTodos: number;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [accountTodos, setAccountTodos] = useState<AccountTodoItem[]>([]);
  const [patientTodos, setPatientTodos] = useState<PatientTodoItem[]>([]);
  const [appointmentTodos, setAppointmentTodos] = useState<AppointmentTodoItem[]>([]);
  const [noteTodos, setNoteTodos] = useState<NoteTodoItem[]>([]);

  // Redirect patients to scheduling page
  if (user?.clientId) {
    return <Navigate to="/scheduling" replace />;
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [accountData, patientData, appointmentData, noteData] = await Promise.all([
        todoService.getAccountTodos(),
        todoService.getPatientTodos(),
        todoService.getAppointmentTodos(),
        todoService.getNoteTodos(),
      ]);

      setAccountTodos(accountData);
      setPatientTodos(patientData);
      setAppointmentTodos(appointmentData);
      setNoteTodos(noteData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats: DashboardStats = useMemo(() => {
    const allTodos = [...accountTodos, ...patientTodos, ...appointmentTodos, ...noteTodos];
    
    return {
      overdueTodos: allTodos.filter(todo => 
        todo.type === 'note' && (todo as NoteTodoItem).daysOverdue && (todo as NoteTodoItem).daysOverdue! > 0
      ).length,
      accountTodos: accountTodos.length,
      patientTodos: patientTodos.length,
      appointmentTodos: appointmentTodos.length,
      noteTodos: noteTodos.length,
    };
  }, [accountTodos, patientTodos, appointmentTodos, noteTodos]);

  const recentTodos = useMemo(() => {
    const allTodos = [...accountTodos, ...patientTodos, ...appointmentTodos, ...noteTodos];
    return allTodos
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [accountTodos, patientTodos, appointmentTodos, noteTodos]);

  const urgentTodos = useMemo(() => {
    const allTodos = [...accountTodos, ...patientTodos, ...appointmentTodos, ...noteTodos];
    return allTodos
      .filter(todo => todo.priority === 'urgent' || todo.priority === 'high')
      .sort((a, b) => {
        if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
        if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      })
      .slice(0, 5);
  }, [accountTodos, patientTodos, appointmentTodos, noteTodos]);

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

  const getTodoIcon = (type: string) => {
    switch (type) {
      case 'account': return <User className="h-4 w-4" />;
      case 'patient': return <Users className="h-4 w-4" />;
      case 'appointment': return <Calendar className="h-4 w-4" />;
      case 'note': return <FileText className="h-4 w-4" />;
      default: return <CheckSquare className="h-4 w-4" />;
    }
  };

  const getTodoTitle = (todo: any) => {
    switch (todo.type) {
      case 'account': return `${todo.userName} - Missing Information`;
      case 'patient': return `${todo.clientName} - Patient Information`;
      case 'appointment': return `${todo.clientName} - ${todo.appointmentType}`;
      case 'note': return `${todo.clientName} - ${todo.noteType}`;
      default: return todo.title;
    }
  };

  const handleAttendMeeting = (meetLink: string) => {
    window.open(meetLink, '_blank');
  };

  if (authLoading || loading) {
    return (
      <PageLayout variant="simple">
        <PageHeader
          icon={LayoutDashboard}
          title="Dashboard"
          description={`${new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}`}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout variant="simple">
      <PageHeader
        icon={LayoutDashboard}
        title="Dashboard"
        description={`${new Date().toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}`}
      />

      <div className="space-y-6">
        {/* Category Breakdown */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Tasks</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.accountTodos}</div>
              <p className="text-xs text-muted-foreground">
                User information missing
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Patient Tasks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.patientTodos}</div>
              <p className="text-xs text-muted-foreground">
                Patient information needed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.appointmentTodos}</div>
              <p className="text-xs text-muted-foreground">
                Appointment-related tasks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Notes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.noteTodos}</div>
              <p className="text-xs text-muted-foreground">
                {stats.overdueTodos > 0 ? `${stats.overdueTodos} overdue` : 'All up to date'}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Urgent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Urgent Tasks
              </CardTitle>
              <CardDescription>
                Tasks requiring immediate attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {urgentTodos.length > 0 ? (
                <div className="space-y-3">
                  {urgentTodos.map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTodoIcon(todo.type)}
                        <div>
                          <p className="font-medium text-sm">{getTodoTitle(todo)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getPriorityBadge(todo.priority)}
                          </div>
                        </div>
                      </div>
                      {todo.type === 'appointment' && (todo as AppointmentTodoItem).isTelehealth && (todo as AppointmentTodoItem).googleMeetLink && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAttendMeeting((todo as AppointmentTodoItem).googleMeetLink!)}
                        >
                          <Video className="h-3 w-3 mr-1" />
                          Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No urgent tasks at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Recent Tasks
              </CardTitle>
              <CardDescription>
                Latest tasks added to the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentTodos.length > 0 ? (
                <div className="space-y-3">
                  {recentTodos.map((todo) => (
                    <div key={todo.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTodoIcon(todo.type)}
                        <div>
                          <p className="font-medium text-sm">{getTodoTitle(todo)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getPriorityBadge(todo.priority)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(todo.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <CheckSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No recent tasks</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Common actions to manage your tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <User className="h-6 w-6" />
                <span className="text-sm">View Account Tasks</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Users className="h-6 w-6" />
                <span className="text-sm">View Patient Tasks</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">View Appointments</span>
              </Button>
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                <FileText className="h-6 w-6" />
                <span className="text-sm">View Notes</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
