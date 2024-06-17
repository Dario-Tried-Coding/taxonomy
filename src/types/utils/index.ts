import { NamespaceKeys, NestedKeyOf, useTranslations } from 'next-intl'

export type I18nNestedKeys = NamespaceKeys<IntlMessages, NestedKeyOf<IntlMessages>>
export type I18nKeys<NestedKey extends I18nNestedKeys = never> = Parameters<ReturnType<typeof useTranslations<NestedKey>>>['0']
