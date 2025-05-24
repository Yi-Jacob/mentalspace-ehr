
import { supabase } from '@/integrations/supabase/client';
import { InsuranceInfo } from '@/types/client';

export const saveInsuranceInfo = async (clientId: string, insuranceInfo: InsuranceInfo[]) => {
  if (insuranceInfo.length === 0) return;

  const insuranceToInsert = insuranceInfo
    .filter(insurance => insurance.insurance_company.trim() !== '')
    .map(insurance => ({
      client_id: clientId,
      insurance_type: insurance.insurance_type,
      insurance_company: insurance.insurance_company,
      policy_number: insurance.policy_number || null,
      group_number: insurance.group_number || null,
      subscriber_name: insurance.subscriber_name || null,
      subscriber_relationship: insurance.subscriber_relationship || null,
      subscriber_dob: insurance.subscriber_dob || null,
      effective_date: insurance.effective_date || null,
      termination_date: insurance.termination_date || null,
      copay_amount: insurance.copay_amount || null,
      deductible_amount: insurance.deductible_amount || null,
    }));

  if (insuranceToInsert.length > 0) {
    const { error: insuranceError } = await supabase
      .from('client_insurance')
      .insert(insuranceToInsert);

    if (insuranceError) {
      console.error('Error saving insurance information:', insuranceError);
    }
  }
};

export const updateInsuranceInfo = async (clientId: string, insuranceInfo: InsuranceInfo[]) => {
  // Delete existing insurance information
  await supabase.from('client_insurance').delete().eq('client_id', clientId);
  
  // Save new insurance information
  await saveInsuranceInfo(clientId, insuranceInfo);
};
