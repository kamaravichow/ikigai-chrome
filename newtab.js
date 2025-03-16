const IkigaiApp = {
  // DOM elements cache
  elements: {
    searchForm: null,
    searchInput: null,
    suggestionsContainer: null,
    body: null,
  },

  // Application state
  state: {
    currentFocusIndex: -1,
  },

  // Configuration options
  config: {
    debounceDelay: 300,
    searchEndpoint: "https://duckduckgo.com/ac/",
    corsProxy: "https://corsproxy.io/?",
  },

  /**
   * Initialize the application
   */
  init() {
    this.cacheElements();
    this.bindEvents();
  },

  /**
   * Cache DOM elements for better performance
   */
  cacheElements() {
    this.elements.searchForm = document.querySelector(".search-container form");
    this.elements.searchInput = document.querySelector(".search-input");
    this.elements.suggestionsContainer = document.querySelector(
      ".search-suggestions"
    );
    this.elements.body = document.body;
  },

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Input event for search suggestions
    this.elements.searchInput.addEventListener(
      "input",
      this.handleInput.bind(this)
    );

    // Keyboard navigation for suggestions
    this.elements.searchInput.addEventListener(
      "keydown",
      this.handleKeyNavigation.bind(this)
    );

    // Close suggestions when clicking outside
    document.addEventListener("click", this.handleOutsideClick.bind(this));

    // Form submission
    this.elements.searchForm.addEventListener(
      "submit",
      this.handleFormSubmit.bind(this)
    );
  },

  /**
   * Handle input changes in search box
   * @param {Event} e - Input event
   */
  handleInput(e) {
    const query = e.target.value.trim();
    this.debouncedFetchSuggestions(query);

    // Toggle search-active class based on input content
    if (query) {
      this.elements.body.classList.add("search-active");
    } else {
      this.elements.body.classList.remove("search-active");
    }
  },

  /**
   * Handle clicks outside the search area
   * @param {Event} e - Click event
   */
  handleOutsideClick(e) {
    if (
      !this.elements.searchInput.contains(e.target) &&
      !this.elements.suggestionsContainer.contains(e.target)
    ) {
      this.clearSuggestions();
    }
  },

  /**
   * Handle form submission
   * @param {Event} e - Submit event
   */
  handleFormSubmit(e) {
    e.preventDefault();
    const query = this.elements.searchInput.value.trim();

    // Check if input is a URL
    if (this.isValidURL(query)) {
      // Add https:// if not present
      let url = query;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      window.location.href = url;
    } else {
      // Use Google search
      window.location.href = `https://google.com/search?q=${encodeURIComponent(
        query
      )}`;
    }
  },

  /**
   * Clear suggestions and reset state
   */
  clearSuggestions() {
    this.elements.suggestionsContainer.innerHTML = "";
    this.elements.suggestionsContainer.classList.remove("active");
    this.state.currentFocusIndex = -1;
  },

  /**
   * Debounce function to limit API calls
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} - Debounced function
   */
  debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  },

  /**
   * Fetch search suggestions from API
   * @param {string} query - Search query
   */
  async fetchSuggestions(query) {
    if (!query) {
      this.clearSuggestions();
      this.elements.body.classList.remove("search-active");
      return;
    }

    // Add search-active class to body when query exists
    this.elements.body.classList.add("search-active");

    try {
      // Using fetch API with a proxy URL
      const encodedUrl = encodeURIComponent(
        `${this.config.searchEndpoint}?q=${encodeURIComponent(query)}&type=list`
      );
      const response = await fetch(`${this.config.corsProxy}${encodedUrl}`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Display suggestions
      if (data && data.length > 0) {
        this.renderSuggestions(data);
      } else {
        this.clearSuggestions();
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      this.clearSuggestions();
    }
  },

  /**
   * Render suggestions in the DOM
   * @param {Array} data - Suggestion data from API
   */
  renderSuggestions(data) {
    this.elements.suggestionsContainer.innerHTML = "";
    this.state.currentFocusIndex = -1;

    data.forEach((suggestionObj) => {
      const suggestion = suggestionObj.phrase;
      const suggestionItem = document.createElement("div");
      suggestionItem.className = "suggestion-item";
      suggestionItem.textContent = suggestion;

      suggestionItem.addEventListener("click", () => {
        this.elements.searchInput.value = suggestion;
        this.clearSuggestions();
        this.elements.searchForm.submit();
      });

      this.elements.suggestionsContainer.appendChild(suggestionItem);
    });

    this.elements.suggestionsContainer.classList.add("active");
  },

  /**
   * Handle keyboard navigation for suggestions
   * @param {KeyboardEvent} e - Keyboard event
   */
  handleKeyNavigation(e) {
    const suggestionItems =
      this.elements.suggestionsContainer.querySelectorAll(".suggestion-item");

    if (!suggestionItems.length) return;

    // Down arrow
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.state.currentFocusIndex =
        this.state.currentFocusIndex < suggestionItems.length - 1
          ? this.state.currentFocusIndex + 1
          : 0;
      this.updateFocus(suggestionItems);
    }
    // Up arrow
    else if (e.key === "ArrowUp") {
      e.preventDefault();
      this.state.currentFocusIndex =
        this.state.currentFocusIndex > 0
          ? this.state.currentFocusIndex - 1
          : suggestionItems.length - 1;
      this.updateFocus(suggestionItems);
    }
    // Enter key
    else if (e.key === "Enter" && this.state.currentFocusIndex > -1) {
      e.preventDefault();
      const selectedSuggestion =
        suggestionItems[this.state.currentFocusIndex].textContent;
      this.elements.searchInput.value = selectedSuggestion;
      this.clearSuggestions();
      this.elements.searchForm.submit();
    }
    // Escape key
    else if (e.key === "Escape") {
      this.clearSuggestions();
    }
  },

  /**
   * Update focus styling for suggestions
   * @param {NodeList} items - Suggestion items
   */
  updateFocus(items) {
    items.forEach((item, index) => {
      if (index === this.state.currentFocusIndex) {
        item.classList.add("suggestion-focused");
      } else {
        item.classList.remove("suggestion-focused");
      }
    });
  },

  /**
   * Check if string is a valid URL
   * @param {string} string - String to check
   * @returns {boolean} - True if valid URL
   */
  isValidURL(string) {
    // URL validation regex
    const pattern =
      /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;
    return pattern.test(string);
  },
};

// Initialize the application when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Create debounced function
  IkigaiApp.debouncedFetchSuggestions = IkigaiApp.debounce(
    IkigaiApp.fetchSuggestions.bind(IkigaiApp),
    IkigaiApp.config.debounceDelay
  );

  // Initialize the app
  IkigaiApp.init();
});
