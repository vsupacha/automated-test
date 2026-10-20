## NI TestStand {.smaller}
Off-the-shelf test management software (development/execution/deployment) for validation and production test

![TestStand](figs/TS_01_NI_TestStand.jpg)\

## Running TestStand example {.smaller}

:::: {.columns}
::: {.column width=77%}
![TestStand](figs/TS_01_NI_TestStand_ex_mobile.jpg)\
:::
::: {.column width=23%}
#### Try example
1. Open Examples > Demos > Mobile Device Test
2. Execute > Run MainSequence

#### Debugging
1. Set breakpoint
2. Step into/over module 
:::
::::

## TestStand terminology {.smaller}

| keywords | details |
| -- | ----- |
| **Sequence**: <br> ordered list of **steps** | - **Step Groups**: Setup / Main / Cleanup <br> - **Variables**: Parameters / Locals / FileGlobals / StationGlobals |
| **Adapters** | connect Steps to Code Modules (LabVIEW, Python, C/C++ DLL, .NET) |
| **Step Types** | - **Tests**: Pass/Fail, Numeric Limit, Multiple Numeric Limit, String Value <br> - **Action**: execute without automatic limit evaluation <br> - **Sequence Call**: call a reusable Sequence <br> - **Statement**: evaluate expressions and update variables <br> - **Flow Control**: If–Else, For, While, Do–While, Sweep |
| **Execution options**: <br> Test UUTs, Single-pass, MainSequence | **Results**: Status, measurements, limits, report, database |

## Process model {.smaller .scrollable}

![ExecOptions](figs/TS_01_Exec_options.jpg)\

## Test UUTs execution {.smaller}

![ExecOptions](figs/TS_01_Test_UUTs.jpg)\

## Process models {.smaller}
:::: {.columns}
::: {.column width=50%}
**Execution**: Test UUTs, Single-pass, MainSequence
:::
::: {.column width=50%}
**Model**: sequential, batch, parallel
:::
::::

![TestStand](figs/TS_01_Model_Config.jpg)\

## Parallel model {.smaller}
![TestStand](figs/TS_01_Parallel_UUT.jpg)\

## Python adaptors {.smaller}
#### ทดลองตัวอย่าง Computer Motherboard Test แบบ Python

:::: {.columns}
::: {.column width=65%}
![TestStand](figs/TS_01_Python_Adaptor.jpg)\
:::
::: {.column width=35%}
1. ติดตั้ง Python
    - ใช้ standalone installer หรือ embedded packages
    - ติดตั้งแบบ admin และเพิ่มเข้าสู่ PATH
2. ใช้ Configure > Adaptors เลือก Python
:::
::::

## TestStand + (LabVIEW/...) &rarr; ATE {.smaller}
Computer-controlled systems that automatically measure and evaluate functional, structural, or electrical performance on electronic devices

| Goals | LabVIEW | TestStand |
| - | -- | -- |
| Connectivity | Direct access via DAQmx, VISA, PXI, proprietary drivers | Adapters for code modules (C/C++ DLL, Python, LabVIEW) |
| Usability | Fully customizable FrontPanel with custom .CTL | TS Operator interface, call sequence from LabVIEW |
| Reusability | SubVI, libraries (.llb), .CTL files | Module adapters, Code modules, SubSequence |
| Maintainability | Patterns for single project  | Sequence for multiple projects |
| Scalability | Single DUT | Multi-DUT, multi-station |