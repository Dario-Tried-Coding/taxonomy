import { I18nKeys } from "@/types/utils"

type ProPlanFeature = {
  label: I18nKeys
  disabled?: boolean
}
export const proPlan: ProPlanFeature[] = [
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.unlimited-posts',
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.unlimited-users',
    disabled: true,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.custom-domain',
    disabled: true,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.dashboard-analytics',
    disabled: true,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.discord',
    disabled: true,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.premium-support',
    disabled: true,
  },
]
