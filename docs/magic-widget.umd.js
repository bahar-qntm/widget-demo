(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? factory(exports, require("react"), require("react-dom")) : typeof define === "function" && define.amd ? define(["exports", "react", "react-dom"], factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, factory(global.MagicWidget = {}, global.React, global.ReactDOM));
})(this, function(exports2, require$$0$1, require$$0) {
  "use strict";
  var createRoot;
  var m$1 = require$$0;
  {
    createRoot = m$1.createRoot;
    m$1.hydrateRoot;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0$1, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  const ProductGrid = ({ products, loading, isMiniView }) => {
    if (loading && (!products || products.length === 0)) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "products-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "products-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-message", children: "Loading products..." }) }) });
    }
    if (!products || products.length === 0) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "products-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "products-grid", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "no-products-message", children: "No products found" }) }) });
    }
    const getProductEffects = (product) => {
      var _a;
      if ((_a = product.attributes) == null ? void 0 : _a.effects) {
        return Array.isArray(product.attributes.effects) ? product.attributes.effects[0] || "Various" : product.attributes.effects || "Various";
      }
      return "Various";
    };
    const extractNumber = (value) => {
      if (!value) return 0;
      const numStr = String(value).replace(/[^\d.]/g, "");
      return parseFloat(numStr) || 0;
    };
    const getProductTHC = (product) => {
      if (product.attributes) {
        const thc = extractNumber(product.attributes.thc_content || product.attributes.thc);
        const thca = extractNumber(product.attributes.thca_content || product.attributes.thca);
        let nestedThc = 0;
        let nestedThca = 0;
        if (product.attributes.cannabinoids) {
          nestedThc = extractNumber(product.attributes.cannabinoids.THC);
          nestedThca = extractNumber(product.attributes.cannabinoids.THCa || product.attributes.cannabinoids.THCA);
        }
        return Math.max(thc, thca, nestedThc, nestedThca).toFixed(1);
      }
      return "0";
    };
    const getProductCBD = (product) => {
      if (product.attributes) {
        const cbd = extractNumber(product.attributes.cbd_content || product.attributes.cbd);
        const cbda = extractNumber(product.attributes.cbda_content || product.attributes.cbda);
        let nestedCbd = 0;
        let nestedCbda = 0;
        if (product.attributes.cannabinoids) {
          nestedCbd = extractNumber(product.attributes.cannabinoids.CBD);
          nestedCbda = extractNumber(product.attributes.cannabinoids.CBDa || product.attributes.cannabinoids.CBDA);
        }
        return Math.max(cbd, cbda, nestedCbd, nestedCbda).toFixed(1);
      }
      return "0";
    };
    const getProductUnit = (product) => {
      const category = product.category;
      if (["Drinks", "Edibles", "Tinctures", "Topicals"].includes(category)) {
        return "mg";
      }
      return "%";
    };
    const handleProductClick = (product) => {
      if (isMiniView) return;
      const url = product.url || "#";
      if (url !== "#") {
        window.open(url, "_blank");
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "products-section", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `products-grid ${loading ? "loading" : ""}`, children: products.map((product, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `product-card ${isMiniView ? "mini-view" : ""}`,
        onClick: () => handleProductClick(product),
        style: {
          cursor: isMiniView ? "default" : "pointer",
          pointerEvents: isMiniView ? "none" : "auto"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-image-container", children: product.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: product.image_url,
              alt: product.name || "Cannabis Product",
              className: "product-image",
              onError: (e) => {
                e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjZjBmMGYwIi8+Cjx0ZXh0IHg9IjIwIiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzk5OTk5OSI+8J+MvzwvdGV4dD4KPHN2Zz4K";
              }
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-image-placeholder", children: "🌿" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-info", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "product-name", children: product.name || "Product" }),
            !isMiniView && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-details", children: [
                product.category || "Cannabis",
                " • ",
                getProductEffects(product)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-details", children: [
                "THC: ",
                getProductTHC(product),
                getProductUnit(product)
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-details", children: [
                "CBD: ",
                getProductCBD(product),
                getProductUnit(product)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "product-price", children: [
              "$",
              product.price || "0"
            ] })
          ] })
        ]
      },
      product.id || index
    )) }) });
  };
  const ChatInterface = ({
    messages,
    onSendMessage,
    streaming,
    progress,
    disabled
  }) => {
    const [inputValue, setInputValue] = require$$0$1.useState("");
    const messagesEndRef = require$$0$1.useRef(null);
    const inputRef = require$$0$1.useRef(null);
    require$$0$1.useEffect(() => {
      var _a;
      (_a = messagesEndRef.current) == null ? void 0 : _a.scrollIntoView({ behavior: "smooth" });
    }, [messages, progress]);
    require$$0$1.useEffect(() => {
      var _a;
      if (!disabled && !streaming) {
        (_a = inputRef.current) == null ? void 0 : _a.focus();
      }
    }, [disabled, streaming]);
    const handleSubmit = async (e) => {
      e.preventDefault();
      const message = inputValue.trim();
      if (!message || streaming || disabled) return;
      setInputValue("");
      await onSendMessage(message);
    };
    const handleKeyPress = (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e);
      }
    };
    const formatMessage = (content) => {
      if (!content) return "";
      let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/^• (.*$)/gm, "<li>$1</li>").replace(/^- (.*$)/gm, '<li class="sub">$1</li>').replace(/^  • (.*$)/gm, '<li class="sub">$1</li>').replace(/\n/g, "<br>");
      formatted = createNestedLists(formatted);
      formatted = formatted.replace(/<br><br>/g, "</p><p>").replace(/^(.*)$/s, function(match) {
        if (match.includes("</p><p>")) {
          return "<p>" + match + "</p>";
        }
        return match;
      });
      return formatted;
    };
    const createNestedLists = (text) => {
      const lines = text.split("<br>");
      let result = [];
      let inList = false;
      let inSubList = false;
      for (let line of lines) {
        if (line.includes("<li>") && !line.includes('class="sub"')) {
          if (inSubList) {
            result.push("</ul>");
            inSubList = false;
          }
          if (!inList) {
            result.push("<ul>");
            inList = true;
          }
          result.push(line);
        } else if (line.includes('<li class="sub">')) {
          if (!inSubList) {
            result.push("<ul>");
            inSubList = true;
          }
          result.push(line.replace(' class="sub"', ""));
        } else {
          if (inSubList) {
            result.push("</ul>");
            inSubList = false;
          }
          if (inList) {
            result.push("</ul>");
            inList = false;
          }
          if (line.trim()) {
            result.push(line);
          }
        }
      }
      if (inSubList) {
        result.push("</ul>");
      }
      if (inList) {
        result.push("</ul>");
      }
      return result.join("");
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chat-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "💬 Chat with Budtender" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "chat-messages", children: [
        messages.map((message) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `chat-message ${message.role} ${message.isFilterResponse ? "filter-response" : ""}`,
            children: [
              message.isFilterResponse && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "filter-response-icon", title: "Auto-generated response based on filter update", children: "🎛️" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "message-content",
                  dangerouslySetInnerHTML: {
                    __html: formatMessage(message.content)
                  }
                }
              ),
              message.timestamp && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "message-timestamp", children: new Date(message.timestamp).toLocaleTimeString() })
            ]
          },
          message.id
        )),
        progress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "progress-message", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "progress-icon", children: progress.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "progress-text", children: progress.message }),
          progress.typing && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "typing-dots", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "form",
        {
          onSubmit: handleSubmit,
          className: `chat-input-container ${streaming || disabled ? "disabled" : ""}`,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: inputRef,
                type: "text",
                className: "chat-input",
                placeholder: streaming ? "AI is responding..." : disabled ? "Please wait..." : "Ask me anything...",
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyPress: handleKeyPress,
                disabled: streaming || disabled
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "chat-send-btn",
                disabled: streaming || disabled || !inputValue.trim(),
                children: streaming ? "..." : "Send"
              }
            )
          ]
        }
      )
    ] });
  };
  const FilterPanel = ({
    filters,
    categoryStats,
    loading,
    onFilterChange
  }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
    const [localFilters, setLocalFilters] = require$$0$1.useState(filters);
    const [syncingFilters, setSyncingFilters] = require$$0$1.useState(/* @__PURE__ */ new Set());
    require$$0$1.useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);
    const debouncedChange = require$$0$1.useCallback(
      debounce((newFilters) => {
        onFilterChange(newFilters, true);
      }, 500),
      [onFilterChange]
    );
    const handleFilterChange = require$$0$1.useCallback((filterKey, value, immediate = false) => {
      const newFilters = { ...localFilters, [filterKey]: value };
      setLocalFilters(newFilters);
      if (immediate) {
        onFilterChange(newFilters, true);
        setSyncingFilters((prev) => new Set(prev).add(filterKey));
        setTimeout(() => {
          setSyncingFilters((prev) => {
            const newSet = new Set(prev);
            newSet.delete(filterKey);
            return newSet;
          });
        }, 1e3);
      } else {
        debouncedChange(newFilters);
      }
    }, [localFilters, onFilterChange, debouncedChange]);
    const handleCategoryChange = require$$0$1.useCallback((category) => {
      handleFilterChange("category", category, true);
    }, [handleFilterChange]);
    const calculateSingleValueDisplay = require$$0$1.useCallback((value, unit = "") => {
      if (!value || value <= 0) return `0${unit}`;
      return `${Math.round(value)}${unit}`;
    }, []);
    const getCurrentCategoryStats = require$$0$1.useCallback(() => {
      return categoryStats[localFilters.category] || {};
    }, [categoryStats, localFilters.category]);
    const showPriceFilter = localFilters.category;
    const showEffectsFilter = localFilters.category;
    const showTHCFilter = localFilters.category && localFilters.category !== "Accessories";
    const showCBDFilter = localFilters.category === "Tinctures";
    const getPotencyUnit = require$$0$1.useCallback((category) => {
      if (["Drinks", "Edibles", "Tinctures", "Topicals"].includes(category)) {
        return "mg";
      }
      return "%";
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filters-section", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "section-title", children: [
        "🎯 Smart Filters",
        (loading || syncingFilters.size > 0) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sync-indicator" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-rows", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-row", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `filter-group ${syncingFilters.has("category") ? "syncing" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "filter-label", children: "Category" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "filter-select",
                value: localFilters.category || "",
                onChange: (e) => handleCategoryChange(e.target.value),
                disabled: loading,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Select Category..." }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Flower", children: "Flower" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Vapes", children: "Vapes" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Pre-Rolls", children: "Pre-Rolls" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Infused Pre-Rolls", children: "Infused Pre-Rolls" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Edibles", children: "Edibles" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Drinks", children: "Drinks" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Concentrates", children: "Concentrates" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Tinctures", children: "Tinctures" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Topicals", children: "Topicals" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "Accessories", children: "Accessories" })
                ]
              }
            )
          ] }),
          showEffectsFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `filter-group ${syncingFilters.has("effects") ? "syncing" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "filter-label", children: "Effects" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "select",
              {
                className: "filter-select",
                value: localFilters.effects || "",
                onChange: (e) => handleFilterChange("effects", e.target.value),
                disabled: loading,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Any Effects" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "body relief", children: "Body Relief" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "creative", children: "Creative" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "energetic", children: "Energetic" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "euphoric", children: "Euphoric" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "focused", children: "Focused" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "relaxing", children: "Relaxing" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sedating", children: "Sedating" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "sleep", children: "Sleep" })
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "filter-row", children: [
          showPriceFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `filter-group range-filter ${syncingFilters.has("price") ? "syncing" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "filter-label", children: "Price (Around)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "filter-range",
                min: ((_a = getCurrentCategoryStats().price_stats) == null ? void 0 : _a.min) || 10,
                max: ((_b = getCurrentCategoryStats().price_stats) == null ? void 0 : _b.max) || 200,
                value: localFilters.price || ((_c = getCurrentCategoryStats().price_stats) == null ? void 0 : _c.avg) || 60,
                onChange: (e) => handleFilterChange("price", parseFloat(e.target.value)),
                disabled: loading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "range-display", children: [
              "$",
              calculateSingleValueDisplay(localFilters.price || ((_d = getCurrentCategoryStats().price_stats) == null ? void 0 : _d.avg) || 60)
            ] })
          ] }),
          showTHCFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `filter-group range-filter ${syncingFilters.has("thc") ? "syncing" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "filter-label", children: [
              "THC Potency (",
              getPotencyUnit(localFilters.category),
              ")"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "filter-range",
                min: ((_e = getCurrentCategoryStats().thc_potency_stats) == null ? void 0 : _e.min) || 0,
                max: ((_f = getCurrentCategoryStats().thc_potency_stats) == null ? void 0 : _f.max) || 100,
                value: localFilters.thc || ((_g = getCurrentCategoryStats().thc_potency_stats) == null ? void 0 : _g.avg) || 20,
                onChange: (e) => handleFilterChange("thc", parseFloat(e.target.value)),
                disabled: loading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "range-display", children: calculateSingleValueDisplay(
              localFilters.thc || ((_h = getCurrentCategoryStats().thc_potency_stats) == null ? void 0 : _h.avg) || 20,
              getPotencyUnit(localFilters.category)
            ) })
          ] }),
          showCBDFilter && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `filter-group range-filter ${syncingFilters.has("cbd") ? "syncing" : ""}`, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "filter-label", children: "CBD Potency (mg)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "range",
                className: "filter-range",
                min: ((_i = getCurrentCategoryStats().cbd_potency_stats) == null ? void 0 : _i.min) || 0,
                max: ((_j = getCurrentCategoryStats().cbd_potency_stats) == null ? void 0 : _j.max) || 100,
                value: localFilters.cbd || ((_k = getCurrentCategoryStats().cbd_potency_stats) == null ? void 0 : _k.avg) || 10,
                onChange: (e) => handleFilterChange("cbd", parseFloat(e.target.value)),
                disabled: loading
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "range-display", children: calculateSingleValueDisplay(
              localFilters.cbd || ((_l = getCurrentCategoryStats().cbd_potency_stats) == null ? void 0 : _l.avg) || 10,
              "mg"
            ) })
          ] })
        ] })
      ] })
    ] });
  };
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  const ParameterDisplay = ({ extractedParams, accumulatedParams }) => {
    var _a;
    const displayParams = accumulatedParams && Object.keys(accumulatedParams).length > 0 ? accumulatedParams : (extractedParams == null ? void 0 : extractedParams.extracted) || {};
    if (!displayParams || Object.keys(displayParams).length === 0) return null;
    const isAccumulatedDisplay = accumulatedParams && Object.keys(accumulatedParams).length > 0;
    const confidence = isAccumulatedDisplay ? 100 : Math.round((((_a = extractedParams == null ? void 0 : extractedParams.extracted) == null ? void 0 : _a.confidence_score) || 0) * 100);
    console.log("🎯 ParameterDisplay - Using accumulated params:", isAccumulatedDisplay, displayParams);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "parameter-extraction-display show", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "extraction-title", children: [
        "🤖 AI Detected Your Preferences",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `confidence-score ${isAccumulatedDisplay ? "accumulated" : ""}`, children: isAccumulatedDisplay ? "Session" : `${confidence}%` })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "extracted-params", children: [
        displayParams.brand && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag brand", children: [
          "🏷️ Brand: ",
          displayParams.brand
        ] }),
        displayParams.categories && displayParams.categories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "📦 Categories: ",
          Array.isArray(displayParams.categories) ? displayParams.categories.join(", ") : displayParams.categories
        ] }),
        displayParams.effects && displayParams.effects.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "✨ Effects: ",
          Array.isArray(displayParams.effects) ? displayParams.effects.join(", ") : displayParams.effects
        ] }),
        displayParams.flavor && displayParams.flavor.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🍃 Flavor: ",
          Array.isArray(displayParams.flavor) ? displayParams.flavor.join(", ") : displayParams.flavor
        ] }),
        displayParams.activity && displayParams.activity.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🎯 Activity: ",
          Array.isArray(displayParams.activity) ? displayParams.activity.join(", ") : displayParams.activity
        ] }),
        displayParams.mood && displayParams.mood.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "😌 Mood: ",
          Array.isArray(displayParams.mood) ? displayParams.mood.join(", ") : displayParams.mood
        ] }),
        displayParams.setting && displayParams.setting.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🏠 Setting: ",
          Array.isArray(displayParams.setting) ? displayParams.setting.join(", ") : displayParams.setting
        ] }),
        displayParams.experience && displayParams.experience.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "✨ Experience: ",
          Array.isArray(displayParams.experience) ? displayParams.experience.join(", ") : displayParams.experience
        ] }),
        displayParams.price && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag priority", children: [
          "💰 Price: around $",
          Math.round(displayParams.price)
        ] }),
        !displayParams.price && displayParams.price_range && Array.isArray(displayParams.price_range) && displayParams.price_range.length === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag priority", children: [
          "💰 Price: $",
          displayParams.price_range[0],
          "-$$",
          displayParams.price_range[1]
        ] }),
        displayParams.thc && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🌿 THC: around ",
          Math.round(displayParams.thc * 10) / 10,
          "%"
        ] }),
        !displayParams.thc && displayParams.thc_range && Array.isArray(displayParams.thc_range) && displayParams.thc_range.length === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🌿 THC: ",
          displayParams.thc_range[0],
          "-",
          displayParams.thc_range[1],
          "%"
        ] }),
        displayParams.cbd && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "💚 CBD: around ",
          Math.round(displayParams.cbd * 10) / 10,
          "mg"
        ] }),
        !displayParams.cbd && displayParams.cbd_range && Array.isArray(displayParams.cbd_range) && displayParams.cbd_range.length === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "💚 CBD: ",
          displayParams.cbd_range[0],
          "-",
          displayParams.cbd_range[1],
          "mg"
        ] }),
        displayParams.potency_preference && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "⚡ Potency: ",
          displayParams.potency_preference
        ] }),
        displayParams.time_of_use && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🕐 Time: ",
          displayParams.time_of_use
        ] }),
        displayParams.social_context && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "👥 Context: ",
          displayParams.social_context
        ] }),
        displayParams.consumption_method && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "💨 Method: ",
          displayParams.consumption_method
        ] }),
        displayParams.experience_level && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "param-tag", children: [
          "🎓 Level: ",
          displayParams.experience_level
        ] })
      ] })
    ] });
  };
  const DebugPanel = ({
    debugState,
    filters,
    extractedParams,
    psychologyGuidance
  }) => {
    var _a, _b, _c;
    const [activeTab, setActiveTab] = require$$0$1.useState("state");
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-section show", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "section-title", children: "🐛 Debug Information" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-tabs", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `debug-tab ${activeTab === "state" ? "active" : ""}`,
            onClick: () => setActiveTab("state"),
            children: "State"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `debug-tab ${activeTab === "filters" ? "active" : ""}`,
            onClick: () => setActiveTab("filters"),
            children: "Filters"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `debug-tab ${activeTab === "parameters" ? "active" : ""}`,
            onClick: () => setActiveTab("parameters"),
            children: "Parameters"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: `debug-tab ${activeTab === "psychology" ? "active" : ""}`,
            onClick: () => setActiveTab("psychology"),
            children: "Psychology"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-content", children: [
        activeTab === "state" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Widget State & Session" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify({
            products: (debugState == null ? void 0 : debugState.products) || 0,
            sessionId: (debugState == null ? void 0 : debugState.sessionId) || null,
            loading: (debugState == null ? void 0 : debugState.loading) || false,
            initializing: (debugState == null ? void 0 : debugState.initializing) || false,
            hasExtractedParams: (debugState == null ? void 0 : debugState.hasExtractedParams) || false,
            hasPsychologyGuidance: (debugState == null ? void 0 : debugState.hasPsychologyGuidance) || false,
            categoryStatsLoaded: (debugState == null ? void 0 : debugState.categoryStatsLoaded) || false,
            timestamp: (/* @__PURE__ */ new Date()).toISOString()
          }, null, 2) })
        ] }),
        activeTab === "filters" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Current Filters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify(filters || {}, null, 2) })
        ] }),
        activeTab === "parameters" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Extracted Parameters" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify({
            extracted: (extractedParams == null ? void 0 : extractedParams.extracted) || null,
            accumulated: (extractedParams == null ? void 0 : extractedParams.accumulated) || (debugState == null ? void 0 : debugState.accumulatedParams) || null,
            confidence: ((_a = extractedParams == null ? void 0 : extractedParams.extracted) == null ? void 0 : _a.confidence_score) || null,
            query_intent: ((_b = extractedParams == null ? void 0 : extractedParams.extracted) == null ? void 0 : _b.query_intent) || null,
            search_strategy: ((_c = extractedParams == null ? void 0 : extractedParams.extracted) == null ? void 0 : _c.search_strategy) || null
          }, null, 2) })
        ] }),
        activeTab === "psychology" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-item", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { children: "Psychology Guidance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("pre", { children: JSON.stringify({
            psychology_guidance: (psychologyGuidance == null ? void 0 : psychologyGuidance.psychology_guidance) || null,
            education_stage: (psychologyGuidance == null ? void 0 : psychologyGuidance.education_stage) || null,
            trust_building_elements: (psychologyGuidance == null ? void 0 : psychologyGuidance.trust_building_elements) || null
          }, null, 2) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stats", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Products:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: (debugState == null ? void 0 : debugState.products) || 0 })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Session:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: (debugState == null ? void 0 : debugState.sessionId) ? "✅" : "❌" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Loading:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: (debugState == null ? void 0 : debugState.loading) ? "🔄" : "✅" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Parameters:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: (debugState == null ? void 0 : debugState.hasExtractedParams) ? "✅" : "❌" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "debug-stat", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-label", children: "Psychology:" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "stat-value", children: (debugState == null ? void 0 : debugState.hasPsychologyGuidance) ? "✅" : "❌" })
        ] })
      ] })
    ] });
  };
  const WidgetHeader = ({
    isMiniView,
    showDebug,
    onToggleMiniView,
    onToggleDebug,
    onResetSession
  }) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "widget-header", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "header-left", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "widget-title", children: "🌿 Budtender" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "header-right", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "reset-toggle",
            onClick: onResetSession,
            title: "Reset session and start fresh",
            children: "🔄 Reset"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "debug-toggle",
            onClick: onToggleDebug,
            title: "Toggle debug panel",
            children: "🐛 Debug"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            className: "toggle-btn",
            onClick: onToggleMiniView,
            title: isMiniView ? "Expand widget" : "Minimize widget",
            children: isMiniView ? "⬆️" : "⬇️"
          }
        )
      ] })
    ] });
  };
  class MagicAPIClient {
    constructor(config = {}) {
      this.tenantId = config.tenantId || "default";
      this.apiKey = config.apiKey || "default-api-key";
      this.apiUrl = config.apiUrl || "http://localhost:8000";
      if (!this.tenantId || !this.apiKey) {
        console.warn("⚠️ MagicAPIClient: Missing tenantId or apiKey in config");
      }
      console.log("🔧 MagicAPIClient initialized:", {
        tenantId: this.tenantId,
        apiUrl: this.apiUrl,
        hasApiKey: !!this.apiKey
      });
    }
    /**
     * Get default headers for API requests
     */
    getHeaders(additionalHeaders = {}) {
      return {
        "X-API-Key": this.apiKey,
        "Content-Type": "application/json",
        ...additionalHeaders
      };
    }
    /**
     * Make API request with error handling
     */
    async makeRequest(url, options = {}) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: this.getHeaders(options.headers || {})
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API request failed: ${response.status} - ${errorText}`);
        }
        return await response.json();
      } catch (error) {
        console.error("❌ API request failed:", error);
        throw error;
      }
    }
    /**
     * Create a new chat session for the widget
     */
    async createSession() {
      const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`;
      const payload = {
        message: "Initialize session",
        // Minimal message to trigger session creation
        experience_level: "beginner"
      };
      console.log("🆔 Creating new session...");
      const result = await this.makeRequest(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      console.log("✅ Session created:", result.session_id);
      return result.session_id;
    }
    /**
     * Get category statistics for filter configuration
     */
    async getCategoryStats() {
      const url = `${this.apiUrl}/category-stats/${this.tenantId}/products/categories/stats`;
      console.log("📊 Fetching category stats...");
      const result = await this.makeRequest(url);
      console.log("✅ Category stats loaded:", Object.keys(result.categories || {}).length, "categories");
      return result;
    }
    /**
     * Get product recommendations (for initial load)
     */
    async getRecommendations(query, profile, limit = 3) {
      var _a;
      const url = `${this.apiUrl}/product/${this.tenantId}/products/recommend`;
      const payload = { query, profile, limit };
      console.log("🎯 Fetching recommendations...");
      const result = await this.makeRequest(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      console.log("✅ Recommendations loaded:", ((_a = result.results) == null ? void 0 : _a.length) || result.length || 0, "products");
      return result;
    }
    /**
     * Update session parameters from UI filter changes
     */
    async updateSessionParameters(sessionId, filters, generateAIResponse = false) {
      const url = new URL(`${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/session/${sessionId}/parameters`);
      if (generateAIResponse) {
        url.searchParams.append("generate_ai_response", "true");
      }
      console.log("� Updating session parameters:", {
        sessionId,
        filters,
        generateAIResponse
      });
      const result = await this.makeRequest(url.toString(), {
        method: "PUT",
        body: JSON.stringify(filters)
      });
      console.log("✅ Session parameters updated:", result.updated_count, "parameters");
      return result;
    }
    /**
     * Send chat message (non-streaming) - for fallback
     */
    async sendChatMessage(message, sessionId, currentFilters) {
      var _a;
      const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`;
      const payload = {
        message: message.trim(),
        session_id: sessionId,
        current_filters: currentFilters || {},
        experience_level: "beginner"
      };
      console.log("💬 Sending chat message (non-streaming):", message);
      const result = await this.makeRequest(url, {
        method: "POST",
        body: JSON.stringify(payload)
      });
      console.log("✅ Chat response received:", {
        hasMessage: !!result.message,
        products: ((_a = result.products) == null ? void 0 : _a.length) || 0,
        hasParameters: !!result.extracted_parameters
      });
      return result;
    }
    /**
     * Get chat history for a session
     */
    async getChatHistory(sessionId) {
      var _a;
      const url = `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/${sessionId}/history`;
      console.log("📜 Fetching chat history for session:", sessionId);
      const result = await this.makeRequest(url);
      console.log("✅ Chat history loaded:", ((_a = result.messages) == null ? void 0 : _a.length) || 0, "messages");
      return result;
    }
    /**
     * Test API connectivity
     */
    async testConnection() {
      try {
        await this.getCategoryStats();
        console.log("✅ API connection test successful");
        return true;
      } catch (error) {
        console.error("❌ API connection test failed:", error);
        return false;
      }
    }
    /**
     * Get streaming URL for EventSource connections
     */
    getStreamingUrl() {
      return `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`;
    }
    /**
     * Build streaming request payload
     */
    buildStreamingPayload(message, sessionId, currentFilters) {
      return {
        message: message.trim(),
        session_id: sessionId,
        current_filters: currentFilters || {},
        experience_level: "beginner"
      };
    }
    /**
     * Validate configuration
     */
    isConfigValid() {
      const hasRequired = this.tenantId && this.apiKey && this.apiUrl;
      if (!hasRequired) {
        console.error("❌ Invalid MagicAPIClient configuration:", {
          hasTenantId: !!this.tenantId,
          hasApiKey: !!this.apiKey,
          hasApiUrl: !!this.apiUrl
        });
      }
      return hasRequired;
    }
    /**
     * Get debug info for troubleshooting
     */
    getDebugInfo() {
      return {
        tenantId: this.tenantId,
        apiUrl: this.apiUrl,
        hasApiKey: !!this.apiKey,
        isValid: this.isConfigValid(),
        endpoints: {
          categoryStats: `${this.apiUrl}/category-stats/${this.tenantId}/products/categories/stats`,
          productSearch: `${this.apiUrl}/product/${this.tenantId}/products/parametric-search`,
          recommendations: `${this.apiUrl}/product/${this.tenantId}/products/recommend`,
          chat: `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat`,
          streaming: `${this.apiUrl}/chat-v2/tenant/${this.tenantId}/chat/stream`
        }
      };
    }
  }
  const useMagicWidget = (config = {}) => {
    const [products, setProducts] = require$$0$1.useState([]);
    const [sessionId, setSessionId] = require$$0$1.useState(null);
    const [categoryStats, setCategoryStats] = require$$0$1.useState({});
    const [isMiniView, setIsMiniView] = require$$0$1.useState(true);
    const [showDebug, setShowDebug] = require$$0$1.useState(false);
    const [filters, setFilters] = require$$0$1.useState({
      category: "",
      effects: "",
      price: null,
      thc: null,
      cbd: null
    });
    const [loading, setLoading] = require$$0$1.useState(false);
    const [initializing, setInitializing] = require$$0$1.useState(true);
    const [extractedParams, setExtractedParams] = require$$0$1.useState(null);
    const [psychologyGuidance, setPsychologyGuidance] = require$$0$1.useState(null);
    const [accumulatedParams, setAccumulatedParams] = require$$0$1.useState({});
    const apiClient = require$$0$1.useMemo(() => new MagicAPIClient(config), [config]);
    const initialize = require$$0$1.useCallback(async () => {
      try {
        setInitializing(true);
        console.log("🚀 Starting parallel initialization...");
        const startTime = performance.now();
        const [newSessionId, stats, response] = await Promise.all([
          apiClient.createSession(),
          apiClient.getCategoryStats(),
          apiClient.getRecommendations("", {}, 3)
        ]);
        const loadTime = performance.now() - startTime;
        setSessionId(newSessionId);
        setCategoryStats(stats.categories || {});
        setProducts(response.results || response || []);
        console.log(`✅ Magic Widget initialized successfully in ${loadTime.toFixed(0)}ms with session:`, newSessionId);
      } catch (error) {
        console.error("❌ Magic Widget initialization failed:", error);
        setProducts([]);
        setSessionId(null);
      } finally {
        setInitializing(false);
      }
    }, [apiClient]);
    const resetSession = require$$0$1.useCallback(async () => {
      console.log("🔄 Resetting widget session...");
      try {
        setSessionId(null);
        setProducts([]);
        setFilters({
          category: "",
          effects: "",
          price: null,
          thc: null,
          cbd: null
        });
        setExtractedParams(null);
        setPsychologyGuidance(null);
        setAccumulatedParams({});
        await initialize();
        console.log("✅ Widget session reset successfully");
      } catch (error) {
        console.error("❌ Failed to reset session:", error);
      }
    }, [initialize]);
    const calculateRange = require$$0$1.useCallback((midpoint, percentage = 20) => {
      if (!midpoint || midpoint <= 0) return null;
      const delta = midpoint * percentage / 100;
      return {
        min: Math.max(0, midpoint - delta),
        max: midpoint + delta,
        midpoint,
        display: `${Math.round(midpoint - delta)}-${Math.round(midpoint + delta)}`
      };
    }, []);
    const filtersToSearchCriteria = require$$0$1.useCallback((currentFilters) => {
      const criteria = {};
      if (currentFilters.category) {
        criteria.categories = [currentFilters.category];
      }
      if (currentFilters.effects) {
        criteria.effects = [currentFilters.effects];
      }
      if (currentFilters.price) {
        criteria.price = currentFilters.price;
      }
      if (currentFilters.thc) {
        criteria.thc = currentFilters.thc;
      }
      if (currentFilters.cbd) {
        criteria.cbd = currentFilters.cbd;
      }
      return criteria;
    }, []);
    const debugState = require$$0$1.useMemo(() => ({
      products: products.length,
      sessionId,
      filters,
      accumulatedParams,
      loading,
      initializing,
      hasExtractedParams: !!extractedParams,
      hasPsychologyGuidance: !!psychologyGuidance,
      categoryStatsLoaded: Object.keys(categoryStats).length > 0
    }), [
      products.length,
      sessionId,
      filters,
      accumulatedParams,
      loading,
      initializing,
      extractedParams,
      psychologyGuidance,
      categoryStats
    ]);
    return {
      // Core data
      products,
      setProducts,
      sessionId,
      setSessionId,
      categoryStats,
      // UI state
      isMiniView,
      setIsMiniView,
      showDebug,
      setShowDebug,
      // Filter state
      filters,
      setFilters,
      filtersToSearchCriteria,
      // Loading states
      loading,
      setLoading,
      initializing,
      // Parameter state
      extractedParams,
      setExtractedParams,
      psychologyGuidance,
      setPsychologyGuidance,
      accumulatedParams,
      setAccumulatedParams,
      // Actions
      initialize,
      resetSession,
      calculateRange,
      // API client
      apiClient,
      // Debug
      debugState
    };
  };
  const useStreamingChat = ({
    config,
    sessionId,
    setSessionId,
    currentFilters,
    onMessage,
    onProducts,
    onParametersExtracted,
    onPsychologyGuidance,
    onFiltersUpdated
  }) => {
    const [streaming, setStreaming] = require$$0$1.useState(false);
    const [progress, setProgress] = require$$0$1.useState(null);
    const activeStreamRef = require$$0$1.useRef(null);
    const apiClient = new MagicAPIClient(config);
    const sendStreamingMessage = require$$0$1.useCallback(async (message) => {
      if (streaming) {
        console.warn("🚫 Stream already in progress, ignoring new message");
        return;
      }
      setStreaming(true);
      setProgress({ icon: "🤖", message: "Understanding your request...", typing: false });
      try {
        console.log("🌊 Starting streaming chat for message:", message);
        const payload = {
          message: message.trim(),
          session_id: sessionId,
          current_filters: currentFilters || {},
          experience_level: "beginner"
        };
        const streamUrl = `${apiClient.apiUrl}/chat-v2/tenant/${apiClient.tenantId}/chat/stream`;
        const response = await fetch(streamUrl, {
          method: "POST",
          headers: {
            "X-API-Key": apiClient.apiKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Streaming failed: ${response.status} - ${errorText}`);
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        activeStreamRef.current = { reader };
        let streamedData = {
          message: "",
          session_id: sessionId,
          products: [],
          psychology_guidance: {},
          extracted_parameters: {},
          education_stage: "awareness",
          trust_building_elements: [],
          updated_filters: {},
          accumulated_parameters: {}
        };
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split("\n");
            for (const line of lines) {
              if (line.startsWith("data: ")) {
                const data = line.slice(6);
                if (data === "[DONE]") break;
                try {
                  const parsed = JSON.parse(data);
                  switch (parsed.type) {
                    case "progress":
                      setProgress({
                        icon: parsed.icon,
                        message: parsed.message,
                        typing: parsed.typing || false
                      });
                      console.log(`📡 Stream progress: ${parsed.icon} ${parsed.message}`);
                      break;
                    case "session_id":
                      streamedData.session_id = parsed.session_id;
                      if (setSessionId) {
                        setSessionId(parsed.session_id);
                      }
                      console.log(`🆔 Session ID: ${parsed.session_id}`);
                      break;
                    case "message_chunk":
                      streamedData.message += parsed.content;
                      break;
                    case "products":
                      streamedData.products = parsed.products;
                      console.log(`📦 Products: ${parsed.products.length} items`);
                      break;
                    case "psychology_guidance":
                      streamedData.psychology_guidance = parsed.psychology_guidance;
                      streamedData.education_stage = parsed.education_stage;
                      streamedData.trust_building_elements = parsed.trust_building_elements;
                      console.log(`🧠 Psychology guidance: ${parsed.education_stage} stage`);
                      break;
                    case "extracted_parameters":
                      streamedData.extracted_parameters = parsed.extracted_parameters;
                      console.log(`🤖 Parameters extracted: ${Object.keys(parsed.extracted_parameters).length} params`);
                      break;
                    case "filter_updates":
                      streamedData.updated_filters = parsed.filters;
                      console.log(`🎛️ Filter updates: ${Object.keys(parsed.filters).length} filters`);
                      break;
                    case "accumulated_parameters":
                      streamedData.accumulated_parameters = parsed.accumulated_parameters;
                      console.log(`💾 Accumulated parameters: ${Object.keys(parsed.accumulated_parameters).length} params`);
                      break;
                    case "error":
                      console.error("❌ Streaming error:", parsed.message);
                      throw new Error(parsed.message);
                    default:
                      console.log("📡 Unknown stream type:", parsed.type);
                  }
                } catch (parseError) {
                  console.debug("Skipping invalid JSON chunk:", data);
                }
              }
            }
          }
        } finally {
          reader.releaseLock();
          activeStreamRef.current = null;
        }
        console.log("✅ Streaming complete, processing results...");
        setProgress(null);
        if (streamedData.message && onMessage) {
          onMessage(streamedData.message);
        }
        if (streamedData.products && streamedData.products.length > 0 && onProducts) {
          onProducts(streamedData.products);
        }
        if (streamedData.extracted_parameters && Object.keys(streamedData.extracted_parameters).length > 0 && onParametersExtracted) {
          onParametersExtracted({
            extracted: streamedData.extracted_parameters,
            accumulated: streamedData.accumulated_parameters
          });
        }
        if (streamedData.psychology_guidance && Object.keys(streamedData.psychology_guidance).length > 0 && onPsychologyGuidance) {
          onPsychologyGuidance({
            psychology_guidance: streamedData.psychology_guidance,
            education_stage: streamedData.education_stage,
            trust_building_elements: streamedData.trust_building_elements
          });
        }
        if (streamedData.updated_filters && Object.keys(streamedData.updated_filters).length > 0 && onFiltersUpdated) {
          onFiltersUpdated(streamedData.updated_filters);
        }
        console.log("✅ Streaming chat completed successfully");
      } catch (error) {
        console.error("❌ Streaming chat error:", error);
        setProgress(null);
        if (onMessage) {
          onMessage("Sorry, I encountered an error. Please try again.");
        }
      } finally {
        setStreaming(false);
        activeStreamRef.current = null;
      }
    }, [
      streaming,
      sessionId,
      setSessionId,
      currentFilters,
      onMessage,
      onProducts,
      onParametersExtracted,
      onPsychologyGuidance,
      onFiltersUpdated,
      apiClient,
      config
    ]);
    const cancelStream = require$$0$1.useCallback(() => {
      var _a;
      if ((_a = activeStreamRef.current) == null ? void 0 : _a.reader) {
        activeStreamRef.current.reader.cancel();
        activeStreamRef.current = null;
        setStreaming(false);
        setProgress(null);
        console.log("🚫 Stream cancelled");
      }
    }, []);
    return {
      sendStreamingMessage,
      streaming,
      progress,
      setProgress,
      cancelStream
    };
  };
  const MagicWidget = ({ config = {} }) => {
    const {
      // Products and session
      products,
      setProducts,
      sessionId,
      setSessionId,
      // UI state
      isMiniView,
      setIsMiniView,
      showDebug,
      setShowDebug,
      // Filter state
      filters,
      setFilters,
      categoryStats,
      // Loading states
      loading,
      setLoading,
      // Parameter state
      extractedParams,
      setExtractedParams,
      accumulatedParams,
      setAccumulatedParams,
      // Initialization
      initialize,
      resetSession,
      // API client
      apiClient,
      // Debug state
      debugState
    } = useMagicWidget(config);
    const [messages, setMessages] = require$$0$1.useState([
      {
        id: 1,
        role: "assistant",
        content: "Hi! I'm your budtender. Tell me what you're looking for or ask me anything!",
        timestamp: /* @__PURE__ */ new Date()
      }
    ]);
    const hasProductAffectingParameters = require$$0$1.useCallback((params) => {
      var _a, _b, _c, _d, _e;
      if (!(params == null ? void 0 : params.extracted)) return false;
      const extracted = params.extracted;
      return !!(((_a = extracted.categories) == null ? void 0 : _a.length) > 0 || ((_b = extracted.effects) == null ? void 0 : _b.length) > 0 || ((_c = extracted.price_range) == null ? void 0 : _c.length) === 2 || ((_d = extracted.thc_range) == null ? void 0 : _d.length) === 2 || ((_e = extracted.cbd_range) == null ? void 0 : _e.length) === 2 || extracted.brand || extracted.potency_preference || extracted.requires_products === true);
    }, []);
    const convertBackendToReactFilters = require$$0$1.useCallback((backendFilters) => {
      var _a, _b;
      const converted = {};
      if (((_a = backendFilters.categories) == null ? void 0 : _a.length) > 0) {
        const category = backendFilters.categories[0];
        converted.category = category.charAt(0).toUpperCase() + category.slice(1);
      }
      if (((_b = backendFilters.effects) == null ? void 0 : _b.length) > 0) {
        converted.effects = backendFilters.effects[0];
      }
      if (backendFilters.price) {
        converted.price = backendFilters.price;
      }
      if (backendFilters.thc) {
        converted.thc = backendFilters.thc;
      }
      if (backendFilters.cbd) {
        converted.cbd = backendFilters.cbd;
      }
      return converted;
    }, []);
    const {
      sendStreamingMessage,
      streaming,
      progress,
      setProgress
    } = useStreamingChat({
      config,
      sessionId,
      setSessionId,
      currentFilters: filters,
      onMessage: require$$0$1.useCallback((message) => {
        setMessages((prev) => [...prev, {
          id: Date.now(),
          role: "assistant",
          content: message,
          timestamp: /* @__PURE__ */ new Date()
        }]);
      }, []),
      onProducts: require$$0$1.useCallback((newProducts) => {
        if (newProducts && newProducts.length > 0) {
          console.log("🔄 Products updated from streaming chat:", newProducts.length);
          setProducts(newProducts);
        }
      }, [setProducts]),
      onParametersExtracted: require$$0$1.useCallback((params) => {
        setExtractedParams(params);
        if (params.accumulated) {
          setAccumulatedParams(params.accumulated);
          console.log("💾 Updated accumulated parameters:", params.accumulated);
        }
        if (hasProductAffectingParameters(params) && isMiniView) {
          console.log("🎛️ Revealing filters - AI extracted product parameters:", params.extracted);
          setIsMiniView(false);
        }
      }, [setExtractedParams, setAccumulatedParams, hasProductAffectingParameters, isMiniView, setIsMiniView]),
      onFiltersUpdated: require$$0$1.useCallback((backendFilters) => {
        const reactFilters = convertBackendToReactFilters(backendFilters);
        console.log("🎛️ Converting backend filters to React format:", backendFilters, "→", reactFilters);
        setFilters((prev) => ({ ...prev, ...reactFilters }));
      }, [setFilters, convertBackendToReactFilters])
    });
    require$$0$1.useEffect(() => {
      initialize();
    }, [initialize]);
    const handleSendMessage = require$$0$1.useCallback(async (message) => {
      const userMessage = {
        id: Date.now(),
        role: "user",
        content: message,
        timestamp: /* @__PURE__ */ new Date()
      };
      setMessages((prev) => [...prev, userMessage]);
      await sendStreamingMessage(message);
    }, [sendStreamingMessage]);
    const handleFilterChange = require$$0$1.useCallback(async (newFilters, shouldSearch = true) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      if (shouldSearch && !streaming && sessionId) {
        setLoading(true);
        try {
          const isSignificantChange = newFilters.category && newFilters.category !== filters.category || newFilters.effects && newFilters.effects !== filters.effects || newFilters.price && Math.abs((newFilters.price || 0) - (filters.price || 0)) > 20 || newFilters.thc !== void 0 && Math.abs((newFilters.thc || 0) - (filters.thc || 0)) > 5 || newFilters.cbd !== void 0 && Math.abs((newFilters.cbd || 0) - (filters.cbd || 0)) > 5;
          if (isSignificantChange) {
            console.log("💬 Significant filter change detected - using parameter endpoint with AI response");
            setProgress({
              icon: "✏️",
              message: "Typing",
              typing: true
            });
          }
          const sessionResponse = await apiClient.updateSessionParameters(
            sessionId,
            updatedFilters,
            isSignificantChange
            // generate_ai_response=true only for significant changes
          );
          setProgress(null);
          if (sessionResponse.products) {
            setProducts(sessionResponse.products);
            console.log("✅ Products updated from parameter endpoint:", sessionResponse.products.length);
          }
          if (sessionResponse.ai_response) {
            const aiMessage = {
              id: Date.now(),
              role: "assistant",
              content: sessionResponse.ai_response,
              timestamp: /* @__PURE__ */ new Date(),
              isFilterResponse: true
              // Mark as filter-generated response
            };
            setMessages((prev) => [...prev, aiMessage]);
            console.log("🤖 Added AI filter change explanation to chat");
          }
          if (sessionResponse.accumulated_parameters) {
            setAccumulatedParams(sessionResponse.accumulated_parameters);
            console.log("💾 Updated accumulated parameters from UI filter change:", sessionResponse.accumulated_parameters);
          }
        } catch (error) {
          setProgress(null);
          console.error("❌ Failed to update filters and products:", error);
        } finally {
          setLoading(false);
        }
      }
    }, [filters, setFilters, streaming, sessionId, setLoading, apiClient, setProducts, setMessages, setProgress, setAccumulatedParams]);
    const handleToggleMiniView = require$$0$1.useCallback(() => {
      setIsMiniView((prev) => !prev);
    }, [setIsMiniView]);
    const handleToggleDebug = require$$0$1.useCallback(() => {
      setShowDebug((prev) => !prev);
    }, [setShowDebug]);
    const handleResetSession = require$$0$1.useCallback(async () => {
      console.log("🔄 Resetting widget session and chat...");
      setMessages([
        {
          id: 1,
          role: "assistant",
          content: "Hi! I'm your budtender. Tell me what you're looking for or ask me anything!",
          timestamp: /* @__PURE__ */ new Date()
        }
      ]);
      await resetSession();
    }, [resetSession]);
    require$$0$1.useEffect(() => {
      const adjustPageLayout = () => {
        const widget = document.querySelector(".magic-widget");
        if (widget) {
          document.body.style.paddingTop = `${widget.offsetHeight + 10}px`;
        }
      };
      adjustPageLayout();
      window.addEventListener("resize", adjustPageLayout);
      return () => {
        window.removeEventListener("resize", adjustPageLayout);
        document.body.style.paddingTop = "";
      };
    }, [isMiniView]);
    const handleWidgetClick = require$$0$1.useCallback((event) => {
      if (!isMiniView) return;
      if (event.target.closest(".widget-header, .minimize-button")) {
        return;
      }
      event.stopPropagation();
      event.preventDefault();
      handleToggleMiniView();
    }, [isMiniView, handleToggleMiniView]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: `magic-widget ${isMiniView ? "mini-view" : ""}`,
        onClick: handleWidgetClick,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            WidgetHeader,
            {
              isMiniView,
              showDebug,
              onToggleMiniView: handleToggleMiniView,
              onToggleDebug: handleToggleDebug,
              onResetSession: handleResetSession
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "widget-content", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              ProductGrid,
              {
                products,
                loading: loading || streaming,
                isMiniView
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `expandable-sections ${isMiniView ? "collapsed" : "expanded"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "info-displays", children: extractedParams && /* @__PURE__ */ jsxRuntimeExports.jsx(
                ParameterDisplay,
                {
                  extractedParams,
                  accumulatedParams
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                FilterPanel,
                {
                  filters,
                  categoryStats,
                  loading: loading || streaming,
                  onFilterChange: handleFilterChange
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                ChatInterface,
                {
                  messages,
                  onSendMessage: handleSendMessage,
                  streaming,
                  progress,
                  disabled: loading
                }
              ),
              showDebug && /* @__PURE__ */ jsxRuntimeExports.jsx(
                DebugPanel,
                {
                  debugState,
                  filters,
                  extractedParams
                }
              )
            ] })
          ] })
        ]
      }
    );
  };
  function getAutoApiUrl() {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1" || hostname.startsWith("192.168.")) {
      return "http://localhost:8000";
    } else {
      return "https://budtender.cannafax.com";
    }
  }
  const DEFAULT_CONFIG = {
    tenantId: "5388610a-535a-4d3f-92e5-9ae6527f9283",
    apiKey: "aa7cfcf7b7403d6fb3513b1d3dda2825",
    apiUrl: getAutoApiUrl()
    // Automatically detect environment
  };
  function initMagicWidget(container, config = {}) {
    const finalConfig = { ...DEFAULT_CONFIG, ...config };
    console.log("🚀 Initializing Magic Widget with config:", finalConfig);
    console.log("🌐 Auto-detected API URL:", finalConfig.apiUrl);
    const root = createRoot(container);
    root.render(require$$0$1.createElement(MagicWidget, { config: finalConfig }));
    return {
      config: finalConfig,
      cleanup: () => {
        root.unmount();
        console.log("🧹 Magic Widget cleaned up");
      }
    };
  }
  function autoInit() {
    const container = document.getElementById("magic-widget-container");
    if (container) {
      const config = {
        tenantId: container.dataset.tenantId || DEFAULT_CONFIG.tenantId,
        apiKey: container.dataset.apiKey || DEFAULT_CONFIG.apiKey,
        apiUrl: container.dataset.apiUrl || getAutoApiUrl()
        // Auto-detect if not specified
      };
      console.log("🔍 Auto-initializing Magic Widget");
      console.log("🌐 Environment detected:", window.location.hostname);
      console.log("🔌 Using API URL:", config.apiUrl);
      return initMagicWidget(container, config);
    }
    console.log("ℹ️ No magic-widget-container found for auto-init");
    return null;
  }
  if (typeof document !== "undefined") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", autoInit);
    } else {
      autoInit();
    }
  }
  if (typeof window !== "undefined") {
    window.MagicWidget = {
      init: initMagicWidget,
      autoInit
    };
  }
  exports2.MagicWidget = MagicWidget;
  exports2.default = MagicWidget;
  exports2.initMagicWidget = initMagicWidget;
  Object.defineProperties(exports2, { __esModule: { value: true }, [Symbol.toStringTag]: { value: "Module" } });
});
//# sourceMappingURL=magic-widget.umd.js.map
