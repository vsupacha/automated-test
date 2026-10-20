## Running TestStand {.smaller}
:::: {.columns}
::: {.column width=35%}
#### Execution
- [ ] Test UUTs
- [ ] Single Pass
- [ ] Run MainSequence
:::
::: {.column width=65%}
#### Process model
- **Sequential model** (default): test one UUT at a time
- **Batch model**: run common steps for each batch, not for each UUT
- **Parallel model**: run multiple independent test sequences
:::
::::
![Process](figs/TS_04_Process_Flow.jpg)\

## TestStand sequence callbacks {.smaller}
**MainSequence**: Setup &rarr; Main &rarr; Cleanup

![TestStand](figs/TS_04_Seq_Callback.jpg)\

## Test results and data logging {.smaller}

Process model &rarr; MainSequence (Test Steps) &rarr; **Step results** 

:::: {.columns}
::: {.column width=33%}
#### Report
- HTML / XML
- Automatic generation
- Review test results
- Debug & traceability
:::
::: {.column width=33%}
#### Logging
- SQL database
- Manufacturing records
- Yield analysis
:::
::: {.column width=34%}
#### Data Streams
- CSV Input/Output
- Configuration
- Custom logging
:::
::::
![Results](figs/TS_04_Test_Results.jpg){width=90%}\

## TestStand process tutorial {.smaller}
1. เมนู Edit > Sequence File Callbacks เพิ่มตัวเลือก `ProcessSetup`, `ProcessCleanup`, `PreUUT` และ `PostUUT`
2. กำหนดตัวแปรสำหรับจัดการข้อมูลใน **MainSequence**
    - **FileGlobals**: `SerialNumber` (String), `Offset` (Number), `Limit` (Number)
    - **Locals**: `dutValue` (Number)
3. กำหนด step สำหรับการทำงาน

| Callbacks | Operations | 
| :- | :------ |
| `ProcessSetup` | เพิ่ม **Message Popup** รับค่า `FileGlobals.Offset` |
| `PreUUT` | เพิ่ม **Statement** <br> `FileGlobals.SerialNumber = Parameters.UUT.SerialNumber` |

4. ใช้ breakpoint และ step over เพื่อตรวจสอบการรับค่า


## TestStand process tutorial {.smaller .scrollable}
5. กำหนดตัวแปร **Locals** สำหรับการจัดการข้อมูลใน **PreUUT**
    - `Locals.csvRef` (Object Reference) และ `rowData` (Container) 
    - เพิ่มสมาชิก `SerialNumber` (String) และ `Limit` (Number) ให้ตัวแปร `rowData`

6. กำหนด step ใน `PreUUT` เพื่อนำเข้าค่า Limit

| Callbacks | Operations | 
| :- | :------ |
| `PreUUT` | เพิ่ม **New CSV Input Stream** เพื่ออ้างถึงไฟล์ CSV <br> - ระบุตำแหน่งไฟล์ <br> - กำหนด **Input Record Stream Reference** เป็น `Locals.csvRef` <br> - กำหนด **Field Mapping** เป็น "0,1" |
|  | เพิ่ม **Stream Loop** สำหรับวนแยกข้อมูล <br> - กำหนด **Input Record Stream** เป็น `Locals.csvRef` <br> - กำหนด **Input Record** เป็น `Locals.rowData` |
| (**Stream Loop**) | เพิ่ม **If-End** ตรวจสอบเงื่อนไข <br> `FileGlobals.SerialNumber == Locals.rowData.SerialNumber` |
| (**If-End**) | เพิ่ม **Statement** อัพเดทค่า Limit <br> `FileGlobals.Limit = Locals.rowData.Limit` |
| | เพิ่ม **Break** เพื่อจบ loop |

## TestStand process tutorial {.smaller}
7. กำหนด step ใน `MainSequence` เพื่อรับและตรวจสอบค่า Limit

| Callbacks | Operations | 
| :- | :------ |
| `MainSequence` | เพิ่ม **Message Popup** รับค่า `Locals.dutValue` | 
| | เพิ่ม **Statement** คำนวณค่า `dutValue` <br> `Locals.dutValue = Locals.dutValue + FileGlobals.Offset`
| | เพิ่ม **Numeric Limit Test** ทดสอบว่า dutValue < Limit <br> - เมนู Config > Adaptors เลือกเป็น **None** <br> - กำหนด **Data Source** เป็น `Locals.dutValue` <br> - กำหนดเงื่อนไข **LE (<)** โดยตั้งค่าเป็น `FileGlobals.Limit` |

8. ทดสอบป้อนค่าให้ครอบคลุม Pass/Fail

## TestStand process tutorial {.smaller .scrollable}

9. กำหนดตัวแปร **Locals** สำหรับการจัดการข้อมูลใน **PostUUT**

    - `Locals.csvRef` (Object Reference) และ `logData` (Container)
    - เพิ่มสมาชิก `idx` (Number), `SN` (String) และ `Status` (String) ให้ตัวแปร `logData`

10. กำหนด step ใน `PostUUT` เพื่อบันทึกผลในไฟล์ CSV

| Callbacks | Operations | 
| :- | :------ |
| `PostUUT` | เพิ่ม **New CSV Output Stream** เพื่ออ้างถึงไฟล์ CSV <br> - ระบุตำแหน่งไฟล์ <br> - กำหนด **Output Record Stream Reference** เป็น `Locals.csvRef` <br> - กำหนด **Field Mapping** เป็น "0,1,2" | 
| | เพิ่ม **Statement** สำหรับเตรียมข้อมูล^[เว้น expression โดยใช้ **,** (comma)] <br> `Locals.logData.index = Parameters.UUT.UUTLoopIndex,` <br> `Locals.logData.SN = Parameters.UUT.SerialNumber,` <br> `Locals.logData.status = Parameters.Result.Status` |
| | เพิ่ม **Write Record** เพื่อเขียนข้อมูล <br> - กำหนด **Output Record Stream** เป็น `Locals.csvRef` <br> - กำหนด **Record** เป็น `Locals.rowData` |

11. ทดสอบป้อนค่าให้ครอบคลุม Pass/Fail

## Test sequence for LM321 opamp {.smaller}
:::: {.columns}
::: {.column width=50%}
- เงื่อนไขการทดสอบ $V_S$ = ±5V
- Supply current $I_S$ < 1.2 mA
::: 
::: {.column width=50%}
- Offset voltage $V_{OS}$ < 9 mV 
- PSRR > 65 dB  
:::
::::

| Callback | Code modules | Function | Variables | 
| :-- | :--- | :--- | :--- |
| ProcessSetup | `pps_connect` <br> `dmm_connect` <br> `switch_init` <br> `ao_init` <br> `ai_init` | เชื่อมต่อ UDP3305S <br> เชื่อมต่อ UT8805E <br> เชื่อมต่อ NI-9477 <br> เชื่อมต่อ NI-9269 <br> เชื่อมต่อ NI-9239| &rarr; `FG.ppsRef` <br> &rarr; `FG.dmmRef` <br> &rarr; `FG.switchRef` <br> &rarr; `FG.aoRef` <br> &rarr; `FG.aiRef` |
| MainSequence | `pps_ctrl` <br> `ao_update` <br> NumTest `ai_measure` <br> `switch_ctrl` <br> NumTest `dmm_read` | ไฟเลี้ยง AUX ±15V <br> ไฟเลี้ยง DUT ±5V <br> ทดสอบ $V$ < 9V <br> เปิดสวิทช์ S7 <br> ทดสอบ $I_{S}$ < 1.2mA | |
| ProcessCleanup | `visa_close` <br> `daqmx_stop` | ปิด VISA <br> ปิด DAQmx | &larr; ... <br> &larr; ...  |
