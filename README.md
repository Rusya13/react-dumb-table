# React-dumb-table


## Lates releases

## v0.1.0

Changes:

No more height and headerHeight properties

New property "font-size"


## v0.0.25

### Features

- row property "number" (true/false) - right alignment in a column


## v0.0.24

### Fixes

## v0.0.23

### Fixes


## v0.0.22

### Features

- new Props


## v0.0.21

### Features

- added PropTypes

### Fixes

- ref table fix


## v0.0.19

### Fixes

- error in getter

### Features

- now you can use in data:
    - plain objects
    - instance of class with get() method
    - instance of class with getters

- now you can use get("company.employes[2].firstname") if you have in your model class only the method get() which return only "company" object in this case

## v0.0.18

### Fixes

- error if no contextMenu provider

### Features

- key in columns now can be deep like "company.name" or "company.employes[2].first_name"
- add new property: defaultCellValue (undefined by default)

### Warnings

- Column with less than 5


## v0.0.17

### Fixes

- autoScroll to top when offset changed


## v0.0.16

### Fixes

- custom limitSelect
- custom scrollbar
- one event listener on didMount


## v0.0.15

### Fixes

- reload button styles
- padination zero page error
- limit select icon fix
- footer of fix






## TODO

### Callbacks:

- onScrollEnd
- onCellDoubleClick
- onResizeDoubleClick (auto resize of left column to max content width)
- onResizeEnd (send cols width)


### Properties:

for infinity scroll:
- tableBottomStart
- heightTriggerOnScrollEnd
- showHeader





