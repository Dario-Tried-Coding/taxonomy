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
 * @typedef {import('./config').Custom_SE} Custom_SE
 * @typedef {import('./config').Mutation_Changes} MutationChanges
 */

/** @param {import('./config').Script_Params} config */
export function themes_script(config) {
  const html = document.documentElement
  const { themesConfig, default_ST, themesConfig_SK, colorMode_SK, custom_SEK, externalLibrary } = config

  const mustHandle_CM = !externalLibrary || !externalLibrary.colorMode

  /** @type {Unresolved_CM} */ // @ts-expect-error
  const CM_Opts = [...themesConfig.mode.opts, themesConfig.mode.system]

  // ---------------------------------------------------------------------
  // UTILS ---------------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Safely parses the provided string checking if it's actually an object.
   * @param {string | undefined | null} string The string to parse.
   * @returns {unknown} Either an object or undefined.
   */
  function parse_JsonToObj(string) {
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
  function isSameObj(obj1, obj2) {
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

      if ((areObjects && !isSameObj(val1, val2)) || (!areObjects && val1 !== val2)) return false
    }

    return true
  }

  // ---------------------------------------------------------------------
  // COLOR MODE-----------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * Indicates if the browser supports ColorMode preference.
   * @returns {boolean} Either true if it's supported, or false otherwise.
   */
  function supports_CMPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme)').matches
  }

  /**
   * Decides between the provided ColorMode (if valid ResolvedMode) or the fallback ResolvedMode (system's preferred if supported, otherwise default).
   * @param {Unresolved_CM} mode The ColorMode to resolve. MUST BE VALID!!!
   * @returns {Resolved_CM} A ResolvedMode. If 'system', based on the browser's preference.
   */
  function resolve_CM(mode) {
    const supportsDarkMode = supports_CMPref()

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
  function validate_CM(mode, opts) {
    const supportsDarkMode = supports_CMPref()
    const isValid = !!mode && CM_Opts.includes(mode)

    if (!isValid) {
      const fallback_CM = (opts && opts.fallback) || default_ST.mode
      return { value: supportsDarkMode ? fallback_CM : resolve_CM(fallback_CM), passed: false }
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
  function validate_ResolvedCM(mode, opts) {
    const isValid = !!mode && themesConfig.mode.opts.includes(mode)

    if (!isValid) {
      const fallback_CM = (opts && opts.fallback) || default_ST.mode
      return { colorMode: resolve_CM(fallback_CM), passed: false }
    }

    // @ts-expect-error
    return { colorMode: mode, passed: true }
  }

  /**
   * Updates colorScheme & resolvedModeClass with the resolved colorMode provided.
   * @param {Unresolved_CM} colorMode The colorMode to apply.
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.store] Whether to store the new colorMode. Defaults to false.
   */
  function apply_CM(colorMode, opts) {
    const resolvedColorMode = resolve_CM(colorMode)
    set_CS(resolvedColorMode)
    toggle_ResolvedCM_Class(resolvedColorMode)
    if (opts && opts.store) store_CM(colorMode)
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
  function getCurrent_CS(opts) {
    const value = html.style.colorScheme

    const fallback_CM = (opts && opts.fallback) || default_ST.mode
    if (!value) return { value: resolve_CM(fallback_CM), passed: false }

    const { colorMode, passed } = validate_ResolvedCM(value, { fallback: opts && opts.fallback })
    return { value: colorMode, passed }
  }

  /**
   * Updates the color scheme with the provided ResolvedMode, if not already set.
   * @param {Resolved_CM} CS_ToSet The resolved color mode. MUST BE VALID!!!
   */
  function set_CS(CS_ToSet) {
    const current_CS = getCurrent_CS()

    if (current_CS.passed && current_CS.value === CS_ToSet) return
    html.style.colorScheme = CS_ToSet
  }

  // ----------------------------------------------------------------------
  // CLASS ----------------------------------------------------------------
  // ----------------------------------------------------------------------

  /**
   * Toggles the class '.dark' based on the provided ResolvedMode.
   * @param {Resolved_CM} resolved_CM The new resolvedMode.
   */
  function toggle_ResolvedCM_Class(resolved_CM) {
    html.classList.toggle('dark', resolved_CM === 'dark')
    html.classList.toggle('light', resolved_CM === 'light')
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
  function validate_Theme(string, config) {
    const parsedTheme = parse_JsonToObj(string)

    const fallbackTheme = (config && config.fallback) || default_ST
    if (!parsedTheme) return { theme: fallbackTheme, passed: false }

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
        let valueToSet = (config && config.fallback && config.fallback[themeAttr]) || default_ST[themeAttr]
        if (themeAttr === 'mode' && !supports_CMPref()) valueToSet = resolve_CM(valueToSet)

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
  function get_CurrentST(opts) {
    const value = localStorage.getItem(themesConfig_SK)
    const validation = validate_Theme(value, { fallback: opts && opts.fallback })
    return validation
  }

  /**
   * Updates the StorageTheme with the provided Partial<StorageTheme> if not already set.
   * @param {Partial<StorageTheme>} theme The new theme. MUST BE VALID!!!
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.force] Whether to force the update. Defaults to false.
   */
  function store_Theme(theme, opts) {
    const currentStoredTheme = get_CurrentST()

    const themeToUse = currentStoredTheme.theme
    const newTheme = { ...themeToUse }

    // @ts-expect-error
    for (const key in theme) if (newTheme.hasOwnProperty(key)) newTheme[key] = theme[key]

    const mustForceUpdate = opts && opts.force
    const mustStoreNewTheme =
      mustForceUpdate || !currentStoredTheme.passed || (currentStoredTheme.passed && !isSameObj(currentStoredTheme.theme, newTheme))

    if (!mustStoreNewTheme) return
    localStorage.setItem(themesConfig_SK, JSON.stringify(newTheme))
    dispatch_CustomSE({ key: themesConfig_SK, newValue: JSON.stringify(newTheme), oldValue: JSON.stringify(themeToUse) })
  }

  /**
   * Updates all the themeAttrs passed in the theme object, if not already present.
   * @param {Partial<StorageTheme>} theme The theme to apply.
   * @param {Object} [opts] The options object.
   * @param {boolean} [opts.store] Whether to store the new theme. Defaults to false.
   */
  function apply_Theme(theme, opts) {
    if (opts && opts.store) store_Theme(theme)
    set_TAs(theme)
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
  function getCurrent_SCM(opts) {
    const retrievedValue = localStorage.getItem(colorMode_SK)
    return validate_CM(retrievedValue, { fallback: opts && opts.fallback })
  }

  /**
   * Stores the provided ColorMode if not already set.
   * @param {Unresolved_CM} colorMode The ColorMode to set. MUST BE VALID!!!
   */
  function store_CM(colorMode) {
    const current_SCM = getCurrent_SCM()

    const isAlreadyPresent = current_SCM.passed && current_SCM.value === colorMode
    if (isAlreadyPresent) return

    localStorage.setItem(colorMode_SK, colorMode)
    dispatch_CustomSE({ key: colorMode_SK, newValue: colorMode, oldValue: current_SCM.value })
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
  function validate_TA(attr, opts) {
    const { name, value } = attr
    const { fallback } = opts || {}

    const isValidAttr = themesConfig.hasOwnProperty(name)
    const options = name !== 'mode' ? themesConfig[name].opts : CM_Opts
    const isValid = isValidAttr && !!value && options.includes(value)

    if (!isValid) {
      // @ts-expect-error - used for deciding if can fallback to 'system' (if 'system' is provided as fallback)
      if (name === 'mode') return validate_CM(value, { fallback })
      return { value: fallback || default_ST[name], passed: false }
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
  function getCurrent_TA(attrName, opts) {
    const attr = 'data-' + attrName
    const currentValue = html.getAttribute(attr)
    const { fallback } = opts || {}

    const validation = validate_TA({ name: attrName, value: currentValue }, { fallback })
    return validation
  }

  /**
   * Sets the value for the passed themeAttribute, if not already present.
   * @param {Safe_TA} attr The themeAttribute info to set. MUST BE VALID!!!
   */
  function set_TA(attr) {
    const { name, value } = attr
    const currentTA_Validation = getCurrent_TA(name)

    const isAlreadyPresent = currentTA_Validation.passed && currentTA_Validation.value === value
    if (isAlreadyPresent) return

    html.setAttribute('data-' + name, String(value))
  }

  /**
   * Updates the ThemeAttr for each of the props in the passed object, if not already present.
   * @param {Partial<StorageTheme>} theme The theme object to set
   */
  function set_TAs(theme) {
    for (const TA_Name in theme) {
      if (!theme.hasOwnProperty(TA_Name)) continue

      // @ts-expect-error
      set_TA({ name: TA_Name, value: theme[TA_Name] })
    }
  }

  // ---------------------------------------------------------------------
  // STORAGE EVENT -------------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   * @param {Object} detail
   * @param {ThemesConfig_SK | ColorMode_SK} detail.key
   * @param {string} detail.newValue
   * @param {string} detail.oldValue
   */
  function dispatch_CustomSE(detail) {
    const customStorageEvent = new CustomEvent(custom_SEK, { detail })
    window.dispatchEvent(customStorageEvent)
  }

  function setup_SEs_Listening() {
    // Event handlers

    /**
     * Updates storageTheme to mantain it in sync with storageColorMode when it changes (if valid).
     * @param {Object} data The data object containing the new and old values of the color mode.
     * @param {string | null | undefined} data.newValue The new value of the color mode.
     * @param {string | null | undefined} data.oldValue The old value of the color mode.
     * @param {object} [opts] The options object.
     * @param {boolean} [opts.applyColorMode] Whether to apply the new color mode. Defaults to false.
     */
    function handle_SCM_Change(data, opts) {
      const { newValue, oldValue } = data

      const oldCM_Validation = validate_CM(oldValue)
      const newCM_Validation = validate_CM(newValue, { fallback: oldCM_Validation.value })
      if (!mustHandle_CM && !newCM_Validation.passed) return

      if (opts && opts.applyColorMode) apply_CM(newCM_Validation.value)
      store_Theme({ mode: newCM_Validation.value })
    }

    /**
     * Keeps storageTheme & storageColorMode & themeAttributes in sync on storageColorMode change.
     * @param {Object} data The data object containing the new and old values of the color mode.
     * @param {string | null | undefined} data.newValue The new value of the color mode.
     * @param {string | null | undefined} data.oldValue The old value of the color mode.
     */
    function handle_ST_Change(data) {
      const { newValue, oldValue } = data

      const oldTheme_Validation = validate_Theme(oldValue)
      const newTheme_Validation = validate_Theme(newValue, { fallback: oldTheme_Validation.theme })

      const areBothValid = oldTheme_Validation.passed && newTheme_Validation.passed
      const isSameValidTheme = areBothValid && isSameObj(oldTheme_Validation.theme, newTheme_Validation.theme)
      if (isSameValidTheme) return

      apply_Theme(newTheme_Validation.theme, { store: true })
      store_CM(newTheme_Validation.theme.mode)
    }

    // Listeners

    /** @param {StorageEvent} e */
    function SE_Listener(e) {
      const { key, oldValue, newValue } = e
      console.log({ key, oldValue, newValue })

      if (key === colorMode_SK) handle_SCM_Change({ newValue, oldValue }, { applyColorMode: mustHandle_CM })
      else if (key === themesConfig_SK) handle_ST_Change({ newValue, oldValue })
    }
    window.addEventListener('storage', SE_Listener)

    /** @param {Custom_SE} e */
    function customSE_Listener(e) {
      const { key, newValue, oldValue } = e.detail

      if (key === colorMode_SK) handle_SCM_Change({ newValue, oldValue }, { applyColorMode: true })
      else if (key === themesConfig_SK) handle_ST_Change({ newValue, oldValue })
    }
    window.addEventListener(custom_SEK, customSE_Listener)
  }

  // ---------------------------------------------------------------------
  // MUTATION OBSERVER ---------------------------------------------------
  // ---------------------------------------------------------------------

  /**
   *
   * @param {MutationRecord[]} mutations
   * @param {MutationObserver} observer
   */
  function handle_TAs_Change(mutations, observer) {
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

      /** @type {TA_Name} */ // @ts-expect-error
      const attrName = mutation.attributeName.replace('data-', '')

      const oldAttrValidation = validate_TA({ name: attrName, value: oldValue })
      const newAttrValidation = validate_TA({ name: attrName, value: newValue }, { fallback: oldAttrValidation.value })

      const isSameValidValue = oldAttrValidation.passed && newAttrValidation.passed && oldAttrValidation.value === newAttrValidation.value
      if (isSameValidValue) continue

      // @ts-expect-error
      changes[attrName] = newAttrValidation.value
    }

    apply_Theme(changes, { store: true })
  }

  function setupThemeAttrsObserver() {
    const observer = new MutationObserver(handle_TAs_Change)
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
    const currentST_Validation = get_CurrentST()
    apply_Theme(currentST_Validation.theme, { store: !currentST_Validation.passed })

    // Storage ColorMode
    const currentSCM_Validation = getCurrent_SCM()
    if (opts && opts.initColorMode) apply_CM(currentST_Validation.theme.mode, { store: !currentSCM_Validation.passed })

    // Storage Events Listener
    setup_SEs_Listening()

    // Theme Attributes Observer
    setupThemeAttrsObserver()
  }

  init({ initColorMode: mustHandle_CM })
}
