import { onlyDigits, parseCurrency } from './formatters'
import { supabase } from './supabase'
import type { SimulationData } from './simulation'

type LeadExtra = {
  status: string
  pixTransactionId?: string
  pixCode?: string
  pixStatus?: string
  pixError?: string
}

export async function saveLead(data: SimulationData, extra: LeadExtra) {
  try {
    await supabase.from('leads').upsert(
      {
        id: data.leadId,
        status: extra.status,
        name: data.name || null,
        cpf: onlyDigits(data.cpf) || null,
        cpf_situation: data.cpfSituation || null,
        cpf_death_year: data.cpfDeathYear,
        cpf_checked: data.cpfChecked,
        birth_date: data.birthDate || null,
        mother_name: data.motherName || null,
        gender: data.gender || null,
        phone: onlyDigits(data.phone) || null,
        email: data.email || null,
        amount: data.amount,
        installments: data.installments,
        purpose: data.purpose || null,
        occupation: data.occupation || null,
        negativado: data.negativado || null,
        salary: parseCurrency(data.salary),
        no_income: data.noIncome,
        income_day: data.incomeDay,
        approved_amount: data.approvedAmount,
        payment_day: data.paymentDay,
        cep: data.cep || null,
        street: data.street || null,
        number: data.number || null,
        no_number: data.noNumber,
        complement: data.complement || null,
        district: data.district || null,
        city: data.city || null,
        uf: data.uf || null,
        seguro_product_id: data.checkoutProductId || null,
        seguro_price: data.seguroPrice,
        seguro_extra: data.seguroExtra,
        checkout_total: data.checkoutTotal,
        checkout_loan: data.checkoutLoan,
        checkout_bump_ids: data.checkoutBumpIds,
        pix_transaction_id: extra.pixTransactionId ?? null,
        pix_code: extra.pixCode ?? null,
        pix_status: extra.pixStatus ?? null,
        pix_error: extra.pixError ?? null,
        paid_at: extra.status === 'pago' ? new Date().toISOString() : null,
      },
      { onConflict: 'id' },
    )
  } catch {
    void 0
  }
}
