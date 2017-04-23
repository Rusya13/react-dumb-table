"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DumbTable = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DumbTable = exports.DumbTable = function (_React$Component) {
    _inherits(DumbTable, _React$Component);

    function DumbTable(props) {
        _classCallCheck(this, DumbTable);

        var _this = _possibleConstructorReturn(this, (DumbTable.__proto__ || Object.getPrototypeOf(DumbTable)).call(this, props));

        _this.isContextMenuOpen = false;
        _this.cachedColumnsSize = [];
        _this._saveCache();
        _this.state = {
            isLimitSelectOpen: false
        };
        _this.nextClickHandler = _this.nextClickHandler.bind(_this);

        return _this;
    }

    _createClass(DumbTable, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            window.addEventListener("mousedown", this.nextClickHandler);
            this.cols = this.table.getElementsByTagName('col') || [];
            this.headerCells = this.table.getElementsByClassName('dumbTable__headerCell');
            this._setColumnsSize(this.cachedColumnsSize);
        }
    }, {
        key: "componentWillReceiveProps",
        value: function componentWillReceiveProps(props) {
            if (this.props.offset !== props.offset) {
                this.tableBody.scrollTop = 0;
            }
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            window.removeEventListener("mousedown", this.nextClickHandler);
        }
    }, {
        key: "_saveCache",
        value: function _saveCache() {
            var _this2 = this;

            var columns = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props.columns;

            columns.map(function (col) {
                _this2.cachedColumnsSize.push({ width: col.width });
            });
        }
    }, {
        key: "handleMouseDown",
        value: function handleMouseDown(e) {
            e.preventDefault();
            document.body.className += " no-selection";
            var minColWidth = this.props.minColWidth;
            var columns = this.cachedColumnsSize;
            var div = e.target.parentNode;
            var index = Number(div.getAttribute('data-index'));
            var originalOffset = e.clientX;
            var originalWidth = div.offsetWidth;
            var summPx = this.headerCells[index].offsetWidth + this.headerCells[index + 1].offsetWidth;
            document.onmousemove = function (e) {
                var newOffset = e.clientX;
                var diff = newOffset - originalOffset;
                var newSize = originalWidth + diff;
                var pieces = columns[index].width + columns[index + 1].width;
                var piecePx = summPx / pieces;
                var newDiff = diff / piecePx;
                var newLeftWidth = Math.ceil(columns[index].width + newDiff);
                var newRightWidth = Math.ceil(columns[index + 1].width - newDiff);
                if (newLeftWidth * piecePx < minColWidth || newRightWidth * piecePx < minColWidth) {
                    // min-width and max-width for each col
                    return;
                }
                columns[index].width += newDiff;
                columns[index + 1].width = pieces - columns[index].width;
                this._setColumnsSize(this.cachedColumnsSize);
                originalWidth = newSize;
                originalOffset = newOffset;
            }.bind(this);
            document.onmouseup = function () {
                document.body.className = document.body.className.replace(/(?:^|\s)no-selection(?!\S)/g, '');
                document.onmousemove = document.onmouseup = null;
            }.bind(this);
        }
    }, {
        key: "_setColumnsSize",
        value: function _setColumnsSize(columns) {
            var _this3 = this;

            columns.reduce(function (secondIndex, column, index) {
                if (column.width < 5) console.error("Warning: A width in the column can not be less then 5. Change the width parameter in the column with index " + index + ".");
                _this3.cols[index].style.width = column.width + '%';
                _this3.cols[secondIndex].style.width = column.width + '%';
                return secondIndex + 1;
            }, this.cols.length / 2);
        }
    }, {
        key: "_renderColumnsSync",
        value: function _renderColumnsSync(columns) {
            return _react2.default.createElement(
                "colgroup",
                null,
                columns.map(function (ol, index) {
                    return _react2.default.createElement("col", { "data-index": index, key: index });
                })
            );
        }
    }, {
        key: "_orderChangeHandler",
        value: function _orderChangeHandler(orderBy, key, orderDirection) {
            var dir = orderDirection;
            if (orderBy === key) {
                dir = orderDirection === "ASC" ? "DESC" : "ASC";
            }
            this.props.orderChangeHandler && this.props.orderChangeHandler(key, dir);
        }
    }, {
        key: "_renderHeader",
        value: function _renderHeader(columns, headerHeight, orderBy, orderDirection) {
            var _this4 = this;

            return _react2.default.createElement(
                "thead",
                null,
                _react2.default.createElement(
                    "tr",
                    null,
                    columns.map(function (col, index) {
                        return _react2.default.createElement(
                            "th",
                            { style: { height: headerHeight }, "data-index": index, key: index },
                            _react2.default.createElement(
                                "div",
                                {
                                    onClick: _this4._orderChangeHandler.bind(_this4, orderBy, col.sortKey || col.key, orderDirection),
                                    className: "dumbTable__headerCell" },
                                col.name
                            ),
                            (orderBy === col.sortKey || orderBy === col.key) && _react2.default.createElement(
                                "div",
                                { className: "dumbTable__headerSort" },
                                orderDirection === "ASC" ? _react2.default.createElement(
                                    "svg",
                                    { pointerEvents: "none", viewBox: "0 0 24 24", width: "20", height: "20" },
                                    _react2.default.createElement("path", { d: "M7 14l5-5 5 5z" })
                                ) : _react2.default.createElement(
                                    "svg",
                                    { pointerEvents: "none", viewBox: "0 0 24 24", width: "20", height: "20" },
                                    _react2.default.createElement("path", { d: "M7 10l5 5 5-5z" })
                                )
                            ),
                            index != columns.length - 1 && _react2.default.createElement("div", { onMouseDown: _this4.handleMouseDown.bind(_this4),
                                className: "dumbTable__headerCellResize" })
                        );
                    })
                )
            );
        }
    }, {
        key: "_contextClick",
        value: function _contextClick(e, row, index, key) {
            if (this.props.rightClickHandler) {
                this.props.rightClickHandler(e, row, index, key);
                return;
            }
            e.preventDefault();
            var contextMenuWidth = this.props.contextMenuWidth;
            var contextMenuItems = this.props.contextMenuItems;
            var contextMenu = this.table.getElementsByClassName('simple-data-table__context-wrapper')[0];
            var list = contextMenuItems(row, index, key);
            if (!list || list.length < 1) return;
            var renderList = this._renderContextMenuItems(list);
            _reactDom2.default.render(_react2.default.createElement(
                "div",
                null,
                renderList
            ), contextMenu);
            contextMenu.style.display = "block";
            var contextMenuHeight = contextMenuItems.length * 30 + 10;
            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;
            var top = e.clientY;
            var left = e.clientX;
            var rightDist = windowWidth - left;
            var bottomDist = windowHeight - top;
            if (rightDist - 15 < contextMenuWidth) {
                left = left - contextMenuWidth - 25 + rightDist;
            }
            if (bottomDist - 25 < contextMenuHeight) {
                top = top - contextMenuHeight - 25 + bottomDist;
            }
            contextMenu.style.top = top + "px";
            contextMenu.style.left = left + "px";
            // block scroll
            document.onmousewheel = document.onwheel = function () {
                return false;
            };
            if (this.isContextMenuOpen) {
                return;
            }
            this.isContextMenuOpen = true;
        }
    }, {
        key: "nextClickHandler",
        value: function nextClickHandler() {
            var contextMenu = this.table.getElementsByClassName('simple-data-table__context-wrapper')[0];
            if (contextMenu.style.display === "block") {
                contextMenu.style.display = "none";
                this.isContextMenuOpen = false;
                // unblock scroll
                document.onmousewheel = document.onwheel = function () {
                    return true;
                };
            }
            if (this.state.isLimitSelectOpen) {
                this._onClickAfterSelectOpen();
            }
        }
    }, {
        key: "_onCellClickHandler",
        value: function _onCellClickHandler(row, index, column, e) {

            if (this.props.cellClickHandler) {
                this.props.cellClickHandler(row, index, column, {
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey
                });
            }
        }
    }, {
        key: "_get",
        value: function _get(object, path, def) {
            return path.replace(/\[/g, '.').replace(/\]/g, '').split('.').reduce(function (o, k) {
                return (o || {})[k];
            }, object) || def;
        }
    }, {
        key: "_renderRow",
        value: function _renderRow(row, index, columns) {
            var _this5 = this;

            return columns.map(function (column, cellIndex) {
                // get value by key from object or by Getter from class object

                var value = _this5._get(row, column.key);
                if (value === undefined) {
                    if ((typeof row === "undefined" ? "undefined" : _typeof(row)) === "object") {
                        if (row.get && typeof row.get === "function") {
                            var object = column.key.split(".");
                            if (object.length > 1) {
                                var str = object.slice(1).join('.');
                                value = _this5._get(row.get(object[0]), str);
                            } else {
                                value = row.get(object[0]);
                            }
                        }
                    } else {
                        value = _this5.props.defaultCellValue;
                    }
                }

                if (column.render) {
                    value = column.render(row, index, column);
                } else {
                    // parse type email
                    if (column.type === "email") {
                        value = _react2.default.createElement(
                            "a",
                            { href: "mailto:" + value },
                            value
                        );
                    }
                    // parse type link
                    if (column.type === "link") {
                        value = _react2.default.createElement(
                            "a",
                            { target: column.target || "_self",
                                href: row[column.link] || row.get(column.link) },
                            value
                        );
                    }
                }

                return _react2.default.createElement(
                    "td",
                    { className: "dumbTable__contentCell",
                        onClick: _this5._onCellClickHandler.bind(_this5, row, index, column),
                        onContextMenu: _this5._contextHandler.bind(_this5, row, index, column.key),
                        key: cellIndex },
                    value
                );
            });
        }
    }, {
        key: "_contextHandler",
        value: function _contextHandler(row, index, key, e) {
            if (this.props.contextMenuItems) {
                this._contextClick(e, row, index, key);
            }
        }
    }, {
        key: "_renderBody",
        value: function _renderBody(data, columns, rowHeight, selectedRowIndexes) {
            var _this6 = this;

            return _react2.default.createElement(
                "tbody",
                null,
                data.map(function (row, index) {
                    var className = 'dumbTable__contentRow ';

                    if (selectedRowIndexes.some(function (selRow) {
                        return selRow === index;
                    })) {
                        className += 'dumbTable__contentRow--selected';
                    }

                    return _react2.default.createElement(
                        "tr",
                        { style: { height: rowHeight },
                            className: className,
                            key: index },
                        _this6._renderRow(row, index, columns)
                    );
                })
            );
        }
    }, {
        key: "_offsetChangeHandler",
        value: function _offsetChangeHandler(key, currentPage, limit) {
            if (currentPage === key) return;
            console.log(key);
            if (key === "back") {
                key = (currentPage - 2) * limit;
            } else if (key === "forward") {
                key = currentPage * limit;
            } else {
                key = (key - 1) * limit;
            }
            this.props.offsetChangeHandler && this.props.offsetChangeHandler(key);
        }
    }, {
        key: "_renderPagination",
        value: function _renderPagination(offset, limit, total, pages, currentPage) {
            if (pages <= 1) {
                return null;
            }
            // currentPage - 4
            var startPos = 1;
            if (pages > 5) {
                startPos = currentPage > 3 ? currentPage > pages - 3 ? pages - 4 : currentPage - 2 : 1;
            }

            var group = [];

            for (var i = startPos; i <= startPos + 4 && i <= pages; i++) {
                var className = "dumbTablePagination__page";
                if (i === currentPage) {
                    className += " " + className + "--active";
                }

                group.push(_react2.default.createElement(
                    "li",
                    { onClick: this._offsetChangeHandler.bind(this, i, currentPage, limit),
                        className: className,
                        id: i,
                        key: i },
                    i
                ));
            }

            return _react2.default.createElement(
                "div",
                { className: "dumbTablePagination" },
                _react2.default.createElement(
                    "button",
                    { onClick: this._offsetChangeHandler.bind(this, "back", currentPage, limit),
                        className: "dumbTablePagination__btn",
                        disabled: currentPage === startPos },
                    _react2.default.createElement(
                        "svg",
                        { xmlns: "http://www.w3.org/2000/svg", width: "7", height: "12", viewBox: "0 0 7 12" },
                        _react2.default.createElement("path", {
                            d: "M6.5 0.2C6.8 0.5 6.8 1 6.5 1.3L1.8 6 6.5 10.7C6.8 11 6.8 11.5 6.5 11.8 6.2 12.1 5.8 12.1 5.5 11.8L0.2 6.5C-0.1 6.2-0.1 5.8 0.2 5.5L5.5 0.2C5.6 0.1 5.8 0 6 0 6.2 0 6.4 0.1 6.5 0.2Z",
                            fillRule: "evenodd" })
                    )
                ),
                _react2.default.createElement(
                    "ul",
                    { className: "dumbTablePagination__pages" },
                    group
                ),
                _react2.default.createElement(
                    "button",
                    { onClick: this._offsetChangeHandler.bind(this, "forward", currentPage, limit),
                        className: "dumbTablePagination__btn",
                        disabled: currentPage === pages },
                    _react2.default.createElement(
                        "svg",
                        { xmlns: "http://www.w3.org/2000/svg", width: "7", height: "12", viewBox: "0 0 7 12" },
                        _react2.default.createElement("path", {
                            d: "M0.2 11.8C-0.1 11.5-0.1 11 0.2 10.7L4.9 6 0.2 1.3C-0.1 1-0.1 0.5 0.2 0.2 0.5-0.1 1-0.1 1.3 0.2L6.5 5.5C6.8 5.8 6.8 6.2 6.5 6.5L1.3 11.8C1.1 11.9 0.9 12 0.7 12 0.6 12 0.4 11.9 0.2 11.8Z",
                            fillRule: "evenodd" })
                    )
                )
            );
        }
    }, {
        key: "_renderReloadButton",
        value: function _renderReloadButton() {
            return _react2.default.createElement(
                "button",
                { className: "dumbTable__btn reload-btn", onClick: this.props.reloadButtonHandler },
                _react2.default.createElement(
                    "svg",
                    { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "12", viewBox: "0 0 14 12",
                        className: "dumbTable__icon" },
                    _react2.default.createElement("path", {
                        d: "M13.2 1.2L13.2 4.8C13.2 5.1 12.9 5.4 12.6 5.4L9 5.4C8.7 5.4 8.4 5.1 8.4 4.8 8.4 4.5 8.7 4.2 9 4.2L11 4.2C10.2 3.4 9.6 2.8 9.4 2.6 8.9 2.1 8.4 1.8 7.8 1.6 7.2 1.3 6.6 1.2 6 1.2 5.4 1.2 4.8 1.3 4.2 1.6 3.6 1.8 3.1 2.1 2.6 2.6 2.1 3.1 1.8 3.6 1.6 4.2 1.3 4.8 1.2 5.4 1.2 6 1.2 6.6 1.3 7.2 1.6 7.8 1.8 8.4 2.1 8.9 2.6 9.4 3.1 9.9 3.6 10.2 4.2 10.4 4.8 10.7 5.4 10.8 6 10.8 6.6 10.8 7.2 10.7 7.8 10.4 8.4 10.2 8.9 9.9 9.4 9.4 9.7 9.1 9.9 8.9 10.1 8.5 10.3 8.2 10.4 7.9 10.5 7.6 10.6 7.3 11 7.1 11.3 7.2 11.6 7.3 11.8 7.7 11.7 8 11.5 8.4 11.3 8.8 11.1 9.2 10.8 9.6 10.6 9.9 10.2 10.2 9.7 10.8 9 11.3 8.3 11.6 7.9 11.7 7.5 11.8 7.1 11.9 6.8 12 6.4 12 6 12 5.6 12 5.2 12 4.9 11.9 4.5 11.8 4.1 11.7 3.7 11.6 3 11.3 2.3 10.8 1.8 10.2 1.2 9.7 0.7 9 0.4 8.3 0.3 7.9 0.2 7.5 0.1 7.1 0 6.8 0 6.4 0 6 0 5.6 0 5.2 0.1 4.9 0.2 4.5 0.3 4.1 0.4 3.7 0.7 3 1.2 2.3 1.8 1.8 2.3 1.2 3 0.7 3.7 0.4 4.1 0.3 4.5 0.2 4.9 0.1 5.2 0 5.6 0 6 0 6.4 0 6.8 0 7.1 0.1 7.5 0.2 7.9 0.3 8.3 0.4 9 0.7 9.7 1.2 10.2 1.8 10.4 1.9 11.1 2.6 12 3.5L12 1.2C12 0.9 12.3 0.6 12.6 0.6 12.9 0.6 13.2 0.9 13.2 1.2Z",
                        fillRule: "nonzero" })
                )
            );
        }
    }, {
        key: "_onLimitChangeHandler",
        value: function _onLimitChangeHandler(item) {
            this.setState({ isLimitSelectOpen: false });
            this.props.limitSelectorHandler && this.props.limitSelectorHandler(item);
        }
    }, {
        key: "_openSelect",
        value: function _openSelect() {
            this.setState({ isLimitSelectOpen: true });
        }
    }, {
        key: "_onClickAfterSelectOpen",
        value: function _onClickAfterSelectOpen() {
            this.setState({ isLimitSelectOpen: false });
        }
    }, {
        key: "_renderSelectItems",
        value: function _renderSelectItems(items) {
            var _this7 = this;

            if (!items || items && items.length < 1) return null;
            return items.map(function (item, index) {
                return _react2.default.createElement(
                    "div",
                    { onMouseDown: _this7._onLimitChangeHandler.bind(_this7, item),
                        className: "dumbTableSelect__listItem", key: index },
                    item
                );
            });
        }
    }, {
        key: "_renderLimitSelector",
        value: function _renderLimitSelector(limit, limitsList) {
            var _this8 = this;

            return _react2.default.createElement(
                "div",
                { className: "dumbTableSelect", id: "dumbTableSelect", onClick: this._openSelect.bind(this),
                    ref: function ref(limitSelect) {
                        return _this8.limitSelect = limitSelect;
                    } },
                this.state.isLimitSelectOpen && _react2.default.createElement(
                    "div",
                    { className: "dumbTableSelect__list" },
                    this._renderSelectItems(limitsList)
                ),
                _react2.default.createElement(
                    "div",
                    null,
                    limit
                ),
                _react2.default.createElement(
                    "svg",
                    { pointerEvents: "none", className: "dumbTableSelect__icon", xmlns: "http://www.w3.org/2000/svg",
                        width: "10", height: "5", viewBox: "0 0 10 5" },
                    _react2.default.createElement("polygon", { fillRule: "nonzero", points: "0 0 5 5 10 0" })
                )
            );
        }
    }, {
        key: "_renderFooterButtons",
        value: function _renderFooterButtons(buttons) {
            if (!buttons || buttons && buttons.length === 0) return null;

            return buttons.map(function (button, i) {
                return _react2.default.createElement(
                    "button",
                    { onClick: button.onClickHandler, key: i,
                        className: "simple-data-table__button " + (button.className ? button.className : "") },
                    button.title
                );
            });
        }
    }, {
        key: "_renderContextMenuItems",
        value: function _renderContextMenuItems(items) {
            if (!items || items && items.length < 1) return null;
            return items.map(function (item, index) {
                if (item.type === "divider") {
                    return _react2.default.createElement("div", { className: "simple-data-table__context-menu__item__divider", key: index });
                }

                return _react2.default.createElement(
                    "div",
                    { onMouseDown: item.onClickHandler,
                        className: "simple-data-table__context-menu__item", key: index },
                    item.title
                );
            });
        }
    }, {
        key: "render",
        value: function render() {
            var _this9 = this;

            var columns = this.props.columns;
            var cachedColumns = this.cachedColumnsSize;
            var data = this.props.data;
            var rowHeight = this.props.rowHeight;
            var showFooter = this.props.showFooter;
            var footerHeight = this.props.footerHeight;

            var total = this.props.total;
            var limit = this.props.limit;
            var offset = this.props.offset;
            var limitsList = this.props.limitsList;

            var headerHeight = this.props.headerHeight;
            var selectedRowIndexes = this.props.selectedRowIndexes;

            var orderBy = this.props.orderBy;
            var orderDirection = this.props.orderDirection;
            var footerButtons = this.props.footerButtons;

            var pages = Math.ceil(total / limit);
            var currentPage = offset / limit + 1;

            var first_num = offset + 1;
            var last_num = currentPage < pages ? currentPage * limit : total;

            return _react2.default.createElement(
                "div",
                { ref: function ref(_ref2) {
                        return _this9.table = _ref2;
                    }, className: "dumbTable" },
                _react2.default.createElement(
                    "div",
                    { className: "dumbTable__header" },
                    _react2.default.createElement(
                        "table",
                        null,
                        this._renderColumnsSync(cachedColumns),
                        this._renderHeader(columns, headerHeight, orderBy, orderDirection)
                    )
                ),
                _react2.default.createElement(
                    "div",
                    { ref: function ref(_ref) {
                            return _this9.tableBody = _ref;
                        }, className: "dumbTable__content" },
                    _react2.default.createElement(
                        "table",
                        null,
                        this._renderColumnsSync(cachedColumns),
                        this._renderBody(data, columns, rowHeight, selectedRowIndexes)
                    )
                ),
                showFooter && _react2.default.createElement(
                    "div",
                    { className: "simple-data-table__footer", style: { height: footerHeight } },
                    _react2.default.createElement(
                        "div",
                        { className: "simple-data-table__footer-info" },
                        _react2.default.createElement(
                            "div",
                            { className: "dumbTableInfo" },
                            _react2.default.createElement(
                                "span",
                                null,
                                first_num
                            ),
                            " - ",
                            _react2.default.createElement(
                                "span",
                                null,
                                last_num
                            ),
                            " of",
                            _react2.default.createElement(
                                "span",
                                null,
                                " ",
                                total
                            )
                        )
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "simple-data-table__footer-pagination" },
                        this._renderPagination(offset, limit, total, pages, currentPage)
                    ),
                    _react2.default.createElement(
                        "div",
                        { className: "simple-data-table__footer-settings" },
                        this._renderFooterButtons(footerButtons),
                        this._renderReloadButton(),
                        this._renderLimitSelector(limit, limitsList)
                    )
                ),
                _react2.default.createElement("div", { className: "simple-data-table__context-wrapper" })
            );
        }
    }]);

    return DumbTable;
}(_react2.default.Component);

DumbTable.propTypes = {
    columns: _propTypes2.default.array.isRequired,
    data: _propTypes2.default.any.isRequired,
    rowHeight: _propTypes2.default.number,
    minColWidth: _propTypes2.default.number,

    cellClickHandler: _propTypes2.default.func,
    selectedRowIndexes: _propTypes2.default.any,

    showFooter: _propTypes2.default.bool,
    footerHeight: _propTypes2.default.any,
    limit: _propTypes2.default.number,
    offset: _propTypes2.default.number,
    total: _propTypes2.default.number,
    reloadButtonHandler: _propTypes2.default.func,
    limitSelectorHandler: _propTypes2.default.func,
    offsetChangeHandler: _propTypes2.default.func,
    limitsList: _propTypes2.default.arrayOf(_propTypes2.default.number),
    footerButtons: _propTypes2.default.array,

    headerHeight: _propTypes2.default.number,

    orderBy: _propTypes2.default.string,
    orderDirection: _propTypes2.default.oneOf(["ASC", "DESC"]),
    orderChangeHandler: _propTypes2.default.func,

    rightClickHandler: _propTypes2.default.func,

    contextMenuWidth: _propTypes2.default.number,
    contextMenuItems: _propTypes2.default.func,
    defaultCellValue: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number, _propTypes2.default.bool, _propTypes2.default.element])
};

DumbTable.defaultProps = {
    columns: [],
    data: [],
    rowHeight: 30,
    bottomRow: false,
    minColWidth: 60,
    cellClickHandler: null,
    selectedRowIndexes: [],

    showFooter: true,
    footerHeight: 40 + 'px',
    reloadButtonHandler: null,
    limitSelectorHandler: null,
    offsetChangeHandler: null,
    limit: 10,
    offset: 0,
    total: 0,
    limitsList: [10, 25, 50],
    footerButtons: [],

    headerHeight: 40,

    orderBy: "id",
    orderDirection: "ASC",
    orderChangeHandler: null,
    rightClickHandler: null,
    contextMenuWidth: 150,
    contextMenuItems: null,
    defaultCellValue: undefined
};