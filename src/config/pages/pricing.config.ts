import { I18nKeys } from "@/types/utils"

type ProPlanFeature = {
  label: I18nKeys
  enabled?: boolean
}
export const proPlan: ProPlanFeature[] = [
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.unlimited-posts',
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.unlimited-users',
    enabled: false,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.custom-domain',
    enabled: false,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.dashboard-analytics',
    enabled: false,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.discord',
    enabled: false,
  },
  {
    label: 'Pages.Pricing.UI.ProPlan.Features.premium-support',
    enabled: false,
  },
]
