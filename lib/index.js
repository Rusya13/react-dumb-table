"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SimpleTable = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactDom = require("react-dom");

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SimpleTable = exports.SimpleTable = function (_React$Component) {
    _inherits(SimpleTable, _React$Component);

    function SimpleTable(props) {
        _classCallCheck(this, SimpleTable);

        var _this = _possibleConstructorReturn(this, (SimpleTable.__proto__ || Object.getPrototypeOf(SimpleTable)).call(this, props));

        _this.isContextMenuOpen = false;
        _this.cachedColumnsSize = [];
        _this._saveCache();

        _this.state = {
            isContextMenuOpen: false
        };
        return _this;
    }

    _createClass(SimpleTable, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            var table = this.refs.table;


            this.table = table;
            this.cols = table.getElementsByTagName('col') || [];
            this.headerCells = table.getElementsByClassName('simpleTable__headerCell');
            this._setColumnsSize(this.cachedColumnsSize);
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

                var newLeftWidth = columns[index].width + newDiff;
                var newRightWidth = columns[index + 1].width - newDiff;

                if (newLeftWidth * piecePx < minColWidth || newRightWidth * piecePx < minColWidth) {
                    // min-width and max-width for each col
                    return;
                }

                columns[index].width += newDiff;
                columns[index + 1].width -= newDiff;

                var summ = this.cachedColumnsSize.reduce(function (sum, col) {
                    //console.log("index col", col.width);
                    return sum += col.width;
                }, 0);
                //console.log("index all", summ);


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

            // {(orderBy === col.sortKey || orderBy === col.key) ?
            //     <div className="simple-data-table__header-cell-order-container">
            //         {
            //             (orderDirection === "ASC") ?
            //                 <svg viewBox="0 0 24 24" width="20" height="20">
            //                     <path d="M7 14l5-5 5 5z"></path>
            //                 </svg> :
            //                 <svg viewBox="0 0 24 24" width="20" height="20">
            //                     <path d="M7 10l5 5 5-5z"></path>
            //                 </svg>
            //         }
            //
            //     </div> :
            //     null
            // }

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
                                    className: "simpleTable__headerCell" },
                                col.name
                            ),
                            _react2.default.createElement("div", { onMouseDown: _this4.handleMouseDown.bind(_this4),
                                className: "simpleTable__headerCellResize" })
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

            //console.log("index _contextClick", row, index, key);
            var contextMenu = this.table.getElementsByClassName('simple-data-table__context-wrapper')[0];

            var list = contextMenuItems(row, index, key);

            if (!list || list.length < 1) return;

            console.log("index _contextClick", list);

            var renderList = this._renderContextMenuItems(list);

            _reactDom2.default.render(_react2.default.createElement(
                "div",
                null,
                renderList
            ), contextMenu);

            contextMenu.style.display = "block";

            //console.log("index _contextClick", e.clientX, e.clientY);


            var contextMenuHeight = contextMenuItems.length * 30 + 10;

            var windowHeight = window.innerHeight;
            var windowWidth = window.innerWidth;

            //console.log("index _contextClick windowHeight", windowHeight);

            var top = e.clientY;
            var left = e.clientX;

            console.log("index _contextClick", top, left);
            var rightDist = windowWidth - left;
            var bottomDist = windowHeight - top;

            //console.log("index _contextClick bottomDist", bottomDist);

            if (rightDist - 15 < contextMenuWidth) {
                left = left - contextMenuWidth - 25 + rightDist;
            }

            if (bottomDist - 25 < contextMenuHeight) {
                top = top - contextMenuHeight - 25 + bottomDist;
            }
            contextMenu.style.top = top + "px";
            contextMenu.style.left = left + "px";
            //contextMenu.style.height = contextMenuHeight + "px";

            this.tableBody.style.overflowY = "hidden";

            if (this.isContextMenuOpen) {
                return;
            }

            this.isContextMenuOpen = true;
            document.addEventListener("mousedown", this.nextClickHandler.bind(this, contextMenu));
        }
    }, {
        key: "nextClickHandler",
        value: function nextClickHandler(contextMenu) {
            contextMenu.style.display = "none";
            this.isContextMenuOpen = false;
            if (this.tableBody && this.tableBody.style) this.tableBody.style.overflowY = "auto";
            document.removeEventListener("mousedown", this.nextClickHandler);
        }
    }, {
        key: "_onCellClickHandler",
        value: function _onCellClickHandler(e, row, index, column) {

            if (this.props.cellClickHandler) {
                this.props.cellClickHandler(row, index, column, {
                    altKey: e.altKey,
                    ctrlKey: e.ctrlKey,
                    shiftKey: e.shiftKey
                });
            }
        }
    }, {
        key: "_renderRow",
        value: function _renderRow(row, index, columns) {
            var _this5 = this;

            return columns.map(function (column, cellIndex) {
                // get value by key from object or by Getter from class object
                var value = row[column.key] || row.get(column.key);

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
                    { className: "simpleTable__contentCell",
                        onClick: function onClick(e) {
                            return _this5._onCellClickHandler(e, row, index, column);
                        },
                        onContextMenu: function onContextMenu(e) {
                            return _this5._contextClick(e, row, index, column.key);
                        },
                        key: cellIndex },
                    value
                );
            });
        }
    }, {
        key: "_renderBody",
        value: function _renderBody(data, columns, rowHeight, selectedRowIndexes) {
            var _this6 = this;

            return _react2.default.createElement(
                "tbody",
                null,
                data.map(function (row, index) {
                    var className = 'simpleTable__contentRow ';

                    if (selectedRowIndexes.some(function (selRow) {
                        return selRow === index;
                    })) {
                        className += 'simpleTable__contentRow--selected';
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

            var pagesRender = [];
            var startPos = currentPage > 3 ? currentPage > pages - 3 ? pages - 4 : currentPage - 2 : 1;

            var group = [];

            for (var i = startPos; i <= startPos + 4 && i <= pages; i++) {
                var className = "simple-data-table__button";
                if (i === currentPage) className += " active";
                group.push(_react2.default.createElement(
                    "button",
                    { onClick: this._offsetChangeHandler.bind(this, i, currentPage, limit),
                        className: className, id: String(i), key: i },
                    String(i)
                ));
            }

            pagesRender.push(_react2.default.createElement(
                "div",
                { className: "simple-data-table__buttons_group", key: "btn-group" },
                group
            ));

            pagesRender.unshift(_react2.default.createElement(
                "button",
                { onClick: this._offsetChangeHandler.bind(this, "back", currentPage, limit),
                    className: "simple-data-table__button simple-data-table__button-icon",
                    disabled: currentPage === startPos,
                    id: currentPage - 1, key: "back" },
                _react2.default.createElement(
                    "svg",
                    { viewBox: "0 0 24 24", width: "24", height: "24" },
                    _react2.default.createElement("path", { d: "M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" })
                )
            ));
            pagesRender.push(_react2.default.createElement(
                "button",
                { onClick: this._offsetChangeHandler.bind(this, "forward", currentPage, limit),
                    className: "simple-data-table__button simple-data-table__button-icon",
                    disabled: currentPage === pages, id: currentPage + 1,
                    key: "forward" },
                _react2.default.createElement(
                    "svg",
                    { viewBox: "0 0 24 24", width: "24", height: "24" },
                    _react2.default.createElement("path", { d: "M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z" })
                )
            ));

            return _react2.default.createElement(
                "div",
                { className: "simple-data-table__footer-pagination-buttons" },
                pagesRender
            );
        }
    }, {
        key: "_renderReloadButton",
        value: function _renderReloadButton() {
            return _react2.default.createElement(
                "button",
                { className: "simple-data-table__footer-reload-button", onClick: this.props.reloadButtonHandler },
                _react2.default.createElement(
                    "svg",
                    { viewBox: "0 0 24 24", width: "24", height: "24" },
                    _react2.default.createElement("path", {
                        d: "M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" })
                )
            );
        }
    }, {
        key: "_renderLimitSelector",
        value: function _renderLimitSelector(limit, limitsList) {
            var _this7 = this;

            return _react2.default.createElement(
                "div",
                { className: "simple-data-table__footer-limit-selector-wrapper" },
                _react2.default.createElement(
                    "select",
                    {
                        className: "simple-data-table__footer-select",
                        onChange: function onChange(e) {
                            return _this7.props.limitSelectorHandler && _this7.props.limitSelectorHandler(Number(e.target.value));
                        } },
                    limitsList.map(function (limit) {
                        return _react2.default.createElement(
                            "option",
                            { key: limit, value: limit },
                            limit
                        );
                    })
                ),
                _react2.default.createElement(
                    "svg",
                    { viewBox: "0 0 24 24", width: "24", height: "24" },
                    _react2.default.createElement("path", { d: "M7 10l5 5 5-5z" })
                )
            );
        }
    }, {
        key: "_renderFooterButtons",
        value: function _renderFooterButtons(buttons) {
            if (buttons.length === 0) return null;

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
            var _this8 = this;

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

            var contextMenuItems = this.props.contextMenuItems;

            return _react2.default.createElement(
                "div",
                { ref: "table", className: "simpleTable" },
                _react2.default.createElement(
                    "div",
                    { className: "simpleTable__header" },
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
                            return _this8.tableBody = _ref;
                        }, className: "simpleTable__content" },
                    _react2.default.createElement(
                        "table",
                        null,
                        this._renderColumnsSync(cachedColumns),
                        this._renderBody(data, columns, rowHeight, selectedRowIndexes)
                    )
                ),
                showFooter ? _react2.default.createElement(
                    "div",
                    { className: "simple-data-table__footer", style: { height: footerHeight } },
                    _react2.default.createElement(
                        "div",
                        { className: "simple-data-table__footer-info" },
                        _react2.default.createElement(
                            "div",
                            null,
                            first_num,
                            " - ",
                            last_num,
                            " of ",
                            total,
                            " "
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
                ) : null,
                _react2.default.createElement("div", { className: "simple-data-table__context-wrapper" })
            );
        }
    }]);

    return SimpleTable;
}(_react2.default.Component);

SimpleTable.propTypes = {
    columns: _react.PropTypes.array.isRequired,
    data: _react.PropTypes.any.isRequired,
    rowHeight: _react.PropTypes.number,
    minColWidth: _react.PropTypes.number,

    cellClickHandler: _react.PropTypes.func,
    selectedRowIndexes: _react.PropTypes.any,

    showFooter: _react.PropTypes.bool,
    footerHeight: _react.PropTypes.any,
    limit: _react.PropTypes.number,
    offset: _react.PropTypes.number,
    total: _react.PropTypes.number,
    reloadButtonHandler: _react.PropTypes.func,
    limitSelectorHandler: _react.PropTypes.func,
    offsetChangeHandler: _react.PropTypes.func,
    limitsList: _react.PropTypes.arrayOf(_react.PropTypes.number),
    footerButtons: _react.PropTypes.array,

    headerHeight: _react.PropTypes.number,

    orderBy: _react.PropTypes.string,
    orderDirection: _react.PropTypes.oneOf(["ASC", "DESC"]),
    orderChangeHandler: _react.PropTypes.func,

    rightClickHandler: _react.PropTypes.func,

    contextMenuWidth: _react.PropTypes.number,
    contextMenuItems: _react.PropTypes.func
};

SimpleTable.defaultProps = {
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
    total: 100,
    limitsList: [10, 25, 50],
    footerButtons: [],

    headerHeight: 40,

    orderBy: "id",
    orderDirection: "ASC",
    orderChangeHandler: null,
    rightClickHandler: null,
    contextMenuWidth: 150,
    contextMenuItems: function contextMenuItems(row, index, key) {
        return [{ title: "Edit row", onClickHandler: function onClickHandler() {
                return console.log("index action menu click");
            } }, { title: "Delete row", onClickHandler: function onClickHandler() {
                return console.log("index action menu click");
            } }, { type: "divider" }, { title: "Create new", onClickHandler: function onClickHandler() {
                return console.log("index action menu click");
            } }];
    }

};