// @ts-check

/**
 * @typedef {import('./config').ThemesConfig_SK} ThemesConfig_SK
 * @typedef {import('./config').ColorMode_SK} ColorMode_SK
 * @typedef {import('./config').TA_Name} TA_Name
 * @typedef {import('./config').Resolved_CM} Resolved_CM
 * @typedef {import('./config').Unresolved_CM} Unresolved_CM
 * @typedef {import('./config').StorageTheme} StorageTheme
 * @typedef {import('./config').Unsafe_TA} Unsafe_TA
 * @typedef {import('./config').Safe_TA} Safe_TA
 * @typedef {import('./config').Theme_Opt} Theme_Opt
 * @typedef {import('./config').Custom_SE<ThemesConfig_SK | ColorMode_SK>} Custom_SE
 * @typedef {import('./config').Mutation_Changes} MutationChanges
 */

/** @param {import('./config').Script_Params} config */
export function themes_script(config) {
  const html = document.documentElement
  const { themesConfig, defaultStorageTheme, themesConfig_StorageKey, colorMode_StorageKey, externalLibrary } = config

  const isColorModeHandledExternally = externalLibrary && externalLibrary.colorMode

  /** @type {Unresolved_CM} */ // @ts-expect-error
  const allColorModeOpts = [...themesConfig.mode.opts, themesConfig.mode.system]

  // ---------------------------------------------------------------------
  // UTILS ---------------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Safely parses the provided string checking if it's actually an object.
   * @param {string | undefined | null} string The string to parse.
   * @returns {unknown} Either an object or undefined.
   */
  function parseJsonToObject(string) {
    if (typeof string !== 'string') return undefined

    try {
      const result = JSON.parse(string)
      return typeof result === 'object' && result !== null && !Array.isArray(result) ? result : undefined
    } catch (error) {
      return undefined
    }
  }

  /**
   * Checks if the two objects are actually objects and exactly the same.
   * @param {Object} obj1 The first object to compare.
   * @param {Object} obj2 The second object to compare.
   * @returns {boolean} Either true if they are the same, or false otherwise.
   */
  function isEquivalentObject(obj1, obj2) {
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null || Array.isArray(obj1) || Array.isArray(obj2)) {
      return false
    }

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length) return false

    for (const key of keys1) {
      // @ts-expect-error
      const val1 = obj1[key]
      // @ts-expect-error
      const val2 = obj2[key]

      const areObjects =
        typeof val1 === 'object' && typeof val2 === 'object' && val1 !== null && val2 !== null && !Array.isArray(val1) && !Array.isArray(val2)

      if ((areObjects && !isEquivalentObject(val1, val2)) || (!areObjects && val1 !== val2)) return false
    }

    return true
  }

  /**
   * Indicates if the browser supports ColorMode preference.
   * @returns {boolean} Either true if it's supported, or false otherwise.
   */
  function supportsColorSchemePref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme)').matches
  }

  // ---------------------------------------------------------------------
  // COLOR MODE-----------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Decides between the provided ColorMode (if valid ResolvedMode) or the fallback ResolvedMode (system's preferred if supported, otherwise default).
   * @param {Unresolved_CM} mode The ColorMode to resolve. MUST BE VALID!!!
   * @returns {Resolved_CM} A ResolvedMode. If 'system', based on the browser's preference.
   */
  function resolveColorMode(mode) {
    const supportsDarkMode = supportsColorSchemePref()

    if (mode === themesConfig.mode.system) {
      const systemPreferredMode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      return supportsDarkMode ? systemPreferredMode : themesConfig.mode.default
    }
    return mode
  }

  /**
   * Decides between the provided ColorMode (if valid) or a fallback one (fallback if provided, default otherwise) based on browser support.
   * @param {string | undefined | null} mode The string to validate.
   * @param {Object} [opts] The options object.
   * @param {Unresolved_CM} [opts.fallback] The fallback ColorMode to use if the string is not valid. MUST BE VALID!!!
   * @returns {{value: Unresolved_CM, passed: boolean}} A ColorMode and wether if validation succeded.
   */
  function validateColorMode(mode, opts) {
    const supportsDarkMode = supportsColorSchemePref()
    const isValid = !!mode && allColorModeOpts.includes(mode)

    if (!isValid) {
      const colorModeToReturn = (opts && opts.fallback) || defaultStorageTheme.mode
      return { value: supportsDarkMode ? colorModeToReturn : resolveColorMode(colorModeToReturn), passed: false }
    }

    // @ts-expect-error
    return { value: mode, passed: true }
  }

  /**
   * Decides between the provided ResolvedMode (if valid) or a fallback one (fallback if provided, default otherwise).
   * @param {string | undefined | null} mode The string to validate.
   * @param {Object} [opts] The options object.
   * @param {Resolved_CM} [opts.fallback] The fallback ResolvedMode to use if the string is not valid. MUST BE VALID!!!
   * @returns {{colorMode: Resolved_CM, passed: boolean}} A ResolvedMode and wether if validation succeded.
   */
  function validateResolvedMode(mode, opts) {
    const isValid = !!mode && themesConfig.mode.opts.includes(mode)

    if (!isValid) {
      const colorModeToReturn = (opts && opts.fallback) || defaultStorageTheme.mode
      return { colorMode: resolveColorMode(colorModeToReturn), passed: false }
    }

    // @ts-expect-error
    return { colorMode: mode, passed: true }
  }

  /**
   * Updates colorScheme & resolvedModeClass with the resolved colorMode provided.
   * @param {Unresolved_CM} colorMode The colorMode to apply.
   */
  function applyColorMode(colorMode) {
    const resolvedColorMode = resolveColorMode(colorMode)
    setColorScheme(resolvedColorMode)
    toggleResolvedModeClass(resolvedColorMode)
  }

  // ---------------------------------------------------------------------
  // COLOR SCHEME --------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Retrieves the current color scheme value. Validates and returns it (if valid), otherwise either the fallback/default ResolvedMode.
   * @param {Object} [opts] The options object.
   * @param {Resolved_CM} [opts.fallback] The fallback ResolvedMode to use if the value retrieved is not a valid ResolvedMode. MUST BE VALID!!!
   * @returns {{value: Resolved_CM, passed: boolean}} The current color scheme validation info, if supported.
   */
  function getCurrentColorScheme(opts) {
    const value = html.style.colorScheme

    const fallbackMode = (opts && opts.fallback) || defaultStorageTheme.mode
    if (!value) return { value: resolveColorMode(fallbackMode), passed: false }

    const { colorMode, passed } = validateResolvedMode(value, { fallback: opts && opts.fallback })
    return { value: colorMode, passed }
  }

  /**
   * Updates the color scheme with the provided ResolvedMode, if not already set.
   * @param {Resolved_CM} colorSchemeToSet The resolved color mode. MUST BE VALID!!!
   */
  function setColorScheme(colorSchemeToSet) {
    const currentColorScheme = getCurrentColorScheme()

    if (currentColorScheme.passed && currentColorScheme.value === colorSchemeToSet) return
    html.style.colorScheme = colorSchemeToSet
  }

  // ----------------------------------------------------------------------
  // CLASS ----------------------------------------------------------------
  // ----------------------------------------------------------------------

  /**
   * Toggles the class '.dark' based on the provided ResolvedMode.
   * @param {Resolved_CM} resolvedMode The new resolvedMode.
   */
  function toggleResolvedModeClass(resolvedMode) {
    html.classList.toggle('dark', resolvedMode === 'dark')
    html.classList.toggle('light', resolvedMode === 'light')
  }

  // ----------------------------------------------------------------------
  // STORAGE THEME --------------------------------------------------------
  // ----------------------------------------------------------------------

  /**
   * @typedef {{theme: StorageTheme, passed: boolean}} ThemeValidation The theme validation info.
   */

  /**
   * Safely parses and validates the received string returning a VALID StorageTheme (invalid keys are replaced with corresponding fallback/default theme's key) and a boolean indicating if the string validated successfully.
   * @param {string | null | undefined} string The string to parse and validate.
   * @param {Object} [config] The options object.
   * @param {StorageTheme} [config.fallback] The fallback value to use if the string is not valid. MUST BE VALID!!!
   * @return {ThemeValidation} The theme validation info.
   */
  function validateTheme(string, config) {
    const parsedTheme = parseJsonToObject(string)
    if (!parsedTheme) return { theme: (config && config.fallback) || defaultStorageTheme, passed: false }

    /** @type {StorageTheme} */ // @ts-expect-error
    const validated = {}
    let passed = true

    for (const themeAttr in themesConfig) {
      // @ts-expect-error
      const currentOpt = parsedTheme[themeAttr]

      if (!themesConfig.hasOwnProperty(themeAttr) || !currentOpt) continue

      let opts
      // @ts-expect-error
      opts = themesConfig[themeAttr].opts
      if (themeAttr === 'mode') opts = [...opts, themesConfig.mode.system]

      const themeObjHasAttr = parsedTheme.hasOwnProperty(themeAttr)
      const isValidOption = themeObjHasAttr && opts.includes(currentOpt)

      // @ts-expect-error
      if (isValidOption) validated[themeAttr] = currentOpt
      else {
        // @ts-expect-error
        let valueToSet = (config && config.fallback && config.fallback[themeAttr]) || defaultStorageTheme[themeAttr]
        if (themeAttr === 'mode' && !supportsColorSchemePref()) valueToSet = resolveColorMode(valueToSet)

        // @ts-expect-error
        validated[themeAttr] = valueToSet
        passed = false
      }
    }

    if (!passed) return { theme: validated, passed: false }

    return { theme: validated, passed: true }
  }

  /**
   * Retrieves the current stored theme value. Validates it (invalid keys are replaced with corresponding fallback/default theme's key) and returns the validation info's.
   * @param {Object} [opts] The options object.
   * @param {StorageTheme} [opts.fallback] The fallback value to use if the theme is not valid. MUST BE VALID!!!
   * @returns {ThemeValidation} The current storaged theme validation info, if present.
   */
  function getCurrentStorageTheme(opts) {
    const value = localStorage.getItem(themesConfig_StorageKey)
    const validation = validateTheme(value, { fallback: opts && opts.fallback })
    return validation
  }

  /**
   * Updates the StorageTheme with the provided Partial<StorageTheme> if not already set.
   * @param {Partial<StorageTheme>} theme The new theme. MUST BE VALID!!!
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.force] Whether to force the update. Defaults to false.
   */
  function storeTheme(theme, opts) {
    const currentStoredTheme = getCurrentStorageTheme()

    const themeToUse = currentStoredTheme.theme
    const newTheme = { ...themeToUse }

    // @ts-expect-error
    for (const key in theme) if (newTheme.hasOwnProperty(key)) newTheme[key] = theme[key]

    const mustForceUpdate = opts && opts.force
    const mustStoreNewTheme =
      mustForceUpdate || !currentStoredTheme.passed || (currentStoredTheme.passed && !isEquivalentObject(currentStoredTheme.theme, newTheme))

    if (!mustStoreNewTheme) return
    localStorage.setItem(themesConfig_StorageKey, JSON.stringify(newTheme))
  }

  /**
   * Updates all the themeAttrs passed in the theme object, if not already present.
   * @param {Partial<StorageTheme>} theme The theme to apply.
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.store] Whether to store the new theme. Defaults to false.
   */
  function applyTheme(theme, opts) {
    if (opts && opts.store) storeTheme(theme)
    setThemeAttrs(theme)
  }

  // ---------------------------------------------------------------------
  // STORAGE RESOLVED MODE -----------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * @typedef {{value: Unresolved_CM, passed: boolean}} ColorModeValidation The ColorMOde validation info.
   */

  /**
   * Retrieves the current StorageColorMode value. Validates it and returns the validation info's (if invalid retrieved value, fallback/default colorMode returned).
   * @param {Object} [opts] The options object.
   * @param {Unresolved_CM} [opts.fallback] The fallback ColorMode to use if the value retrieved is not a valid ColorMode. MUST BE VALID!!!
   * @returns {ColorModeValidation} The current stored resolved color mode value.
   */
  function getCurrentStorageColorMode(opts) {
    const retrievedValue = localStorage.getItem(colorMode_StorageKey)
    return validateColorMode(retrievedValue, { fallback: opts && opts.fallback })
  }

  /**
   * Stores the provided ColorMode if not already set.
   * @param {Unresolved_CM} colorMode The ColorMode to set. MUST BE VALID!!!
   */
  function storeColorMode(colorMode) {
    const currentStorageColorMode = getCurrentStorageColorMode()

    const isAlreadyPresent = currentStorageColorMode.passed && currentStorageColorMode.value === colorMode
    if (isAlreadyPresent) return

    localStorage.setItem(colorMode_StorageKey, colorMode)
  }

  // ---------------------------------------------------------------------
  // THEME ATTRIBUTES ----------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * @typedef {{value: Theme_Opt, passed: boolean}} ThemeAttrValidation The themeAttribute validation info.
   */

  /**
   * Validates the received themeAttribute returning it (if valid) or the fallback/default value.
   * @param {Unsafe_TA} attr The themeAttribute to validate.
   * @param {Object} [opts] The options object.
   * @param {Theme_Opt} [opts.fallback] The fallback value to use if the value is not valid. MUST BE VALID!!!
   * @return {ThemeAttrValidation} A valid value for that themeAttribute.
   */
  function validateThemeAttr(attr, opts) {
    const { name, value } = attr
    const { fallback } = opts || {}

    const isValidAttr = themesConfig.hasOwnProperty(name)
    const options = name !== 'mode' ? themesConfig[name].opts : allColorModeOpts
    const isValid = isValidAttr && !!value && options.includes(value)

    if (!isValid) {
      // @ts-expect-error - used for deciding if can fallback to 'system' (if 'system' is provided as fallback)
      if (name === 'mode') return validateColorMode(value, { fallback })
      return { value: fallback || defaultStorageTheme[name], passed: false }
    }

    // @ts-expect-error
    return { value: value, passed: true }
  }

  /**
   * Retrieves the current theme attribute value. Validates and returns it (if valid), otherwise either the fallback/default value.
   * @param {TA_Name} attrName The name of the theme attribute to retrieve.
   * @param {object} [opts] The options object.
   * @param {Theme_Opt} [opts.fallback] The fallback value to use if the value is not valid. MUST BE VALID!!!
   * @returns {ThemeAttrValidation} The current theme attribute validation info, if present.
   */
  function getCurrentThemeAttr(attrName, opts) {
    const attr = 'data-' + attrName
    const currentValue = html.getAttribute(attr)
    const { fallback } = opts || {}

    const validation = validateThemeAttr({ name: attrName, value: currentValue }, { fallback })
    return validation
  }

  /**
   * Sets the value for the passed themeAttribute, if not already present.
   * @param {Safe_TA} attr The themeAttribute info to set. MUST BE VALID!!!
   */
  function setThemeAttr(attr) {
    const { name, value } = attr
    const currentAttrValidation = getCurrentThemeAttr(name)

    const isAlreadyPresent = currentAttrValidation.passed && currentAttrValidation.value === value
    if (isAlreadyPresent) return

    html.setAttribute('data-' + name, String(value))
  }

  /**
   * Updates the ThemeAttr for each of the props in the passed object, if not already present.
   * @param {Partial<StorageTheme>} theme The theme object to set
   */
  function setThemeAttrs(theme) {
    for (const themeAttr in theme) {
      if (!theme.hasOwnProperty(themeAttr)) continue

      // @ts-expect-error
      setThemeAttr({ name: themeAttr, value: theme[themeAttr] })
    }
  }

  // ---------------------------------------------------------------------
  // STORAGE EVENT -------------------------------------------------------
  // ---------------------------------------------------------------------

  function setupStorageEventListening() {
    // Event handlers

    /**
     * Updates storageTheme to mantain it in sync with storageColorMode when it changes (if valid).
     * @param {Object} data The data object containing the new and old values of the color mode.
     * @param {Custom_SE['detail']['newValue'] | null} data.newValue The new value of the color mode.
     * @param {string | null} data.oldValue The old value of the color mode.
     * @param {object} [opts] The options object.
     * @param {boolean} [opts.applyColorMode] Whether to apply the new color mode. Defaults to false.
     */
    function handleStorageColorModeChange(data, opts) {
      const { newValue } = data

      const newColorModeValidation = validateColorMode(newValue)
      if (isColorModeHandledExternally && !newColorModeValidation.passed) return

      if (opts && opts.applyColorMode) applyColorMode(newColorModeValidation.value)
      storeTheme({ mode: newColorModeValidation.value })
    }

    /**
     * Keeps storageTheme & storageColorMode & themeAttributes in sync on storageColorMode change.
     * @param {Object} data The data object containing the new and old values of the color mode.
     * @param {string | null} data.newValue The new value of the color mode.
     * @param {string | null} data.oldValue The old value of the color mode.
     */
    function handleStorageThemeChange(data) {
      const { newValue, oldValue } = data

      const oldThemeValidation = validateTheme(oldValue)
      const newThemeValidation = validateTheme(newValue, { fallback: oldThemeValidation.theme })

      const areBothValid = oldThemeValidation.passed && newThemeValidation.passed
      const isSameValidTheme = areBothValid && isEquivalentObject(oldThemeValidation.theme, newThemeValidation.theme)
      if (isSameValidTheme) return

      applyTheme(newThemeValidation.theme, { store: true })
      storeColorMode(newThemeValidation.theme.mode)
    }

    // Listeners

    /** @param {StorageEvent} e */
    function storageEventListener(e) {
      console.log('storageEvent', e)
      const { key, oldValue, newValue } = e

      if (key === colorMode_StorageKey) handleStorageColorModeChange({ newValue, oldValue }, { applyColorMode: !isColorModeHandledExternally })
      else if (key === themesConfig_StorageKey) handleStorageThemeChange({ newValue, oldValue })
    }
    window.addEventListener('storage', storageEventListener)

    /** @param {Custom_SE} e */
    function customStorageEventListener(e) {
      console.log('customStorageEvent', e.detail)
      const { key, newValue, oldValue } = e.detail

      if (key === colorMode_StorageKey) handleStorageColorModeChange({ newValue, oldValue }, { applyColorMode: true })
      else if (key === themesConfig_StorageKey) handleStorageThemeChange({ newValue, oldValue })
    }
    window.addEventListener('customStorageEvent', customStorageEventListener)
  }

  // ---------------------------------------------------------------------
  // MUTATION OBSERVER ---------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   *
   * @param {MutationRecord[]} mutations
   * @param {MutationObserver} observer
   */
  function handleThemeAttrsChange(mutations, observer) {
    /** @type {Partial<MutationChanges>} */
    const changes = {}

    for (let mutation of mutations) {
      const isAttribute = mutation.type === 'attributes'
      const isThemeAttr =
        isAttribute &&
        mutation.attributeName &&
        mutation.attributeName.startsWith('data-') &&
        Object.keys(themesConfig).some((key) => mutation.attributeName && mutation.attributeName.includes(key))

      if (!isThemeAttr) continue

      const oldValue = mutation.oldValue
      const newValue = html.getAttribute(mutation.attributeName)

      /** @type {AttrName} */ // @ts-expect-error
      const attrName = mutation.attributeName.replace('data-', '')

      const oldAttrValidation = validateThemeAttr({ name: attrName, value: oldValue })
      const newAttrValidation = validateThemeAttr({ name: attrName, value: newValue }, { fallback: oldAttrValidation.value })

      const isSameValidValue = oldAttrValidation.passed && newAttrValidation.passed && oldAttrValidation.value === newAttrValidation.value
      if (isSameValidValue) continue

      // @ts-expect-error
      changes[attrName] = newAttrValidation.value
    }

    applyTheme(changes, { store: true })
  }

  function setupThemeAttrsObserver() {
    const observer = new MutationObserver(handleThemeAttrsChange)
    observer.observe(html, { attributes: true, attributeOldValue: true, attributeFilter: Object.keys(themesConfig).map((key) => 'data-' + key) })
  }

  // ---------------------------------------------------------------------
  // INIT ----------------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Handles the initialization of theming.
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.initColorMode] Whether to initialize the colorMode. Defaults to false.
   */
  function init(opts) {
    // Storage Theme
    const currentStorageTheme = getCurrentStorageTheme()

    if (!currentStorageTheme.passed) storeTheme(currentStorageTheme.theme)
    setThemeAttrs(currentStorageTheme.theme)

    // Storage ColorMode
    const currentStorageColorMode = getCurrentStorageColorMode()

    const isValid = currentStorageColorMode.passed
    const isAlreadyPresent = isValid && currentStorageColorMode.value === currentStorageTheme.theme.mode

    if (!isValid || !isAlreadyPresent) storeColorMode(currentStorageTheme.theme.mode)
    if (opts && opts.initColorMode) applyColorMode(currentStorageTheme.theme.mode)

    // Storage Events Listener
    setupStorageEventListening()

    // Theme Attributes Observer
    setupThemeAttrsObserver()
  }

  init({ initColorMode: !isColorModeHandledExternally })
}
