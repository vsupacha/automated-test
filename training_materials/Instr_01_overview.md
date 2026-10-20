## LM321 op-amp as DUT {.smaller}
![LM321](figs/Instr_01_LM321_spec.jpg)\

## DUT + DIB = null detection {.smaller}
:::: {.columns}
::: {.column width=50%}
- **OPA134 AUX opamp**:
    - integrate (110k$\Omega$ - 4.7$\mu F$) $V_{out}$ as feedback $V_F$
:::
::: {.column width=50%}
- **LM321 DUT opamp**:
    - $\approx V_F$/1000 from voltage divider (100 k$\Omega$ - 100 $\Omega$) as offset voltage
:::
::::
![VOS](figs/Instr_01_null_measurement.jpg)\

## Instruments &lrarr; opamp DIB {.smaller}
:::: {.columns}
::: {.column width=50%}
#### cDAQ-9177 chassis
- NI-9239 วัดแรงดัน
- NI-9269 สร้างแรงดันทดสอบ
- NI-9477 ปิด/เปิด relay แนวสัญญาณ 
:::
::: {.column width=50%}
#### Instruments
- UNI-T UT8805E วัดกระแส
- UNI-T UDP3305S แหล่งจ่ายไฟเลี้ยง
- PicoScope 2206B ทดสอบสัญญาณ > 1 kHz
:::
::::
![DIB](figs/Instr_01_DIB_interfaces.jpg){width=80%}\

## $V_{OS}$ measurement {.smaller}
:::: {.columns}
::: {.column width=50%}
1. **UDP3305S**: จ่ายไฟเลี้ยง AUX opamp
2. **NI-9239**: วัดแรงดันที่ test point
:::
::: {.column width=50%}
3. **NI-9477**: คุมสวิทช์เลือกวัดกระแส
4. **NI-9269**: จ่ายไฟเลี้ยง DUT opamp
:::
::::
![VOS](figs/Instr_01_null_measurement.jpg)\


## $I_{S}$ measurement {.smaller}

:::: {.columns}
::: {.column width=50%}
1. **UDP3305S**: จ่ายไฟเลี้ยง AUX opamp
2. **UT8805E**: วัดกระแส $I_{S}$
:::
::: {.column width=50%}
3. **NI-9477**: คุมสวิทช์เลือกวัดกระแส
4. **NI-9269**: จ่ายไฟเลี้ยง DUT opamp
:::
::::
![IS](figs/Instr_01_IS_meas.jpg)\

## Signal interfaces {.smaller}
![Signals](figs/Instr_01_signal.jpg)\

## UDP3305S prog. power supply {.smaller}
:::: {.columns}
::: {.column width=40%}
![UDP3305S-E](figs/Instr_01_UDP3305S.jpg)\
![UDP3305S](figs/Instr_01_UDP3305S_panel.jpg)\
:::
::: {.column width=60%}
#### 4-channel programmable DC power supply
- Total power 328 Watts 
    - CH1/CH2: 0–30V at up to 5A
        - Parallel 10A or series 60V
        - Bipolar ±30V
    - CH3: 0–6V/3A logic-level channel
    - CH4: fixed 5V/2A USB
- Floating grounds &rarr; 4 channels
- SCPI over LAN, RS-232, USB
:::
::::

## $I_{S}$ measurement: UDP3305S {.smaller}
:::: {.columns}
::: {.column width=45%}
![UDP3305S-E](figs/Instr_01_UDP3305S.jpg)\
![UDP3305S](figs/Instr_01_UDP3305S_panel.jpg)\
:::
::: {.column width=55%}
#### AUX opamp supply: ±15V
1. ตั้งค่าแรงดัน 15V &rarr; กดปุ่ม CH1/CH2
    - กดปุ่ม softkey เลือกโหมด Voltage
    - กดปุ่มตัวเลข 15
    - กดปุ่ม softkey เลือกหน่วย V
2. กดปุ่ม ON ของ CH1/CH2

#### เลิกใช้งาน
1. กดปุ่ม OFF ของ CH1/CH2
2. ตั้งค่าแรงดัน 0V &rarr; กดปุ่ม CH1/CH2
    - กดปุ่ม softkey เลือกโหมด Voltage
    - กดปุ่มตัวเลข 0
    - กดปุ่ม softkey เลือกหน่วย V
:::
::::

## UT8805E Digital Multimeter {.smaller}
:::: {.columns}
::: {.column width=42%}
![UT8805](figs/Instr_01_UT8805E.jpg)\
![UT8805](figs/Instr_01_UT8805E_panel.jpg)\
:::
::: {.column width=58%}
#### True-RMS digital multimeter
- Resolution 200000 count (5.5 digit)
- Basic measurements：
    - DC voltage: 200mV, 2V, 20V, 200V, 1000V
    - DC current: 200μA, 2mA, 20mA, 200mA, 2A, 10A
    - AC voltage: RMS 200mV, 2V, 20V, 200V, 750V
    - AC current: RMS 2mA, 20mA, 200mA, 2A, 10A
    - Resistance: 200Ω, 2kΩ, 20kΩ, 200kΩ, 2MΩ, 10MΩ, 100MΩ
    - Capacitance: 2nF, 20nF, 200nF, 2μF, 20μF, 200μF, 2mF
    - Continuity test: fixed 2kΩ
:::
::::

## $I_{S}$ measurement: UT8805E {.smaller}
:::: {.columns}
::: {.column width=50%}
![UT8805](figs/Instr_01_UT8805E.jpg)\
![UT8805](figs/Instr_01_UT8805E_panel.jpg)\
:::
::: {.column width=50%}
#### DC current measurement: 20 mA
1. เลือกโหมด DC current
    - กดปุ่ม Shift
    - กดปุ่ม dcV/**dcI**
2. ตั้งย่านการวัด 20 mA
    - กดปุ่ม F1 Range
    - กดปุ่มลูกศร ขึ้น/ลง ปรับย่านการวัด

#### เลิกใช้งาน
1. เลือกโหมด DC voltage
    - กดปุ่ม **dcV**/dcI
2. ตั้งย่านการวัด AUTO
    - กดปุ่ม F1 Range แล้วกดปุ่ม AUTO
:::
::::

## LabVIEW &lrarr; hardware {.smaller}
:::: {.columns}
::: {.column width=32%}
#### [NI-DAQmx](https://www.ni.com/en/support/documentation/supplemental/06/getting-started-with-ni-daqmx--main-page.html)
- NI instrument driver that controls DAQ systems
- Library of VIs, functions, classes, attributes, and properties to configure, control, stream data

![mioDAQ](figs/LV_01_DAQmx_mioDAQ.jpg){width=75%}\
![cDAQ](figs/LV_01_DAQmx_cDAQ.jpg){width=75%}\
:::
::: {.column width=32%}
#### [NI-VISA](https://www.ni.com/en/support/documentation/supplemental/06/ni-virtual-instrument-software-architecture.html)
- Virtual Instrument Software Architecture 
- Instrument driver and software API used to configure, program, and control instruments
- Interfaces: USB, Ethernet, GPIB, Serial.

![Instrument](figs/LV_01_VISA_instruments.jpg)\
:::
::: {.column width=32%}
#### [NI-PXI](https://www.ni.com/en/shop/pxi/introduction-to-the-pxi-architecture.html)
- HW/SW platform built for test automation
- Synchronize across multiple modules or chassis
- PXI embedded controller = PC inside PXI

![PXI](figs/LV_01_PXI_chassis.jpg)\
:::
::::

## NI MAX {.smaller}
![NI_MAX](figs/Instr_01_NI_MAX.jpg)\

## CompactDAQ {.smaller}
Data acquisition platform with chassis connecting I/O modules to a PC over USB/Ethernet and built-in **timing** and **synchronization** 

:::: {.columns}
::: {.column width=50%}
#### cDAQ-9177 chassis
- 8 slots for cDAQ modules
- Timing resolution: 50 ppm of sample rate
- FIFO buffer for analog and digital I/O channels
:::
::: {.column width=50%}
![cDAQ](figs/Instr_01_cDAQ-9177.jpg)\
![cDAQ](figs/Instr_01_cDAQ_modules.jpg){width=75%}\
:::
::::

## cDAQ modules {.smaller}
:::: {.columns}
::: {.column width=32%}
#### NI-9239

- 4-channel ±10 V differential analog input
- 24-Bit Delta-Sigma ADC
- Simultaneous 50 kS/s/ch
- 250 Vrms channel-to-channel isolation 

![NI-9239](figs/Instr_01_NI_9239.jpg)\
:::
::: {.column width=32%}
#### NI-9269

- 4-channel ±10 V isolated analog output
- 16-bit R-2R DAC
- Simultaneous 100 kS/s/ch
- 250 Vrms channel-to-channel isolation

![NI-9269](figs/Instr_01_NI_9269.jpg)\
:::
::: {.column width=32%}
#### NI-9477

- 32-channel (sinking output) digital
- 5 V - 60 V  logic level
- 20 A of current/module (max 1 A/channel)

![NI-9477](figs/Instr_01_NI_9477.jpg)\
:::
::::

## cDAQ connectivity {.smaller}
![Connectors](figs/Instr_01_cDAQ_connectors.jpg)\

## $I_{S}$ measurement: NI-9477 {.smaller}

:::: {.columns}
::: {.column width=50%}
![Switch](figs/Instr_01_NI_9477_TestPanel.jpg)\
:::
::: {.column width=50%}
#### Relay selection: S7 ON
1. เปิด Test Panel ของ NI-9477 จาก NI MAX
2. เปิดสวิทช์ line7

#### เลิกใช้งาน
1. ปิดสวิทช์ line7
:::
::::

## $I_{S}$ measurement: NI-9269 {.smaller}

:::: {.columns}
::: {.column width=50%}
![AO](figs/Instr_01_NI_9269_TestPanel.jpg)\
:::
::: {.column width=50%}
#### DUT opamp supply: ±5V 
1. เปิด Test Panel ของ NI-9269 จาก NI MAX
2. ตั้งค่า Voltage 5V
    - เลือก Channel **ao/ao0** และ **ao/ao1**
    - ตั้ง Output Value 5V
    - กดปุ่ม Update 

#### เลิกใช้งาน
1. ตั้งค่า Voltage 0V
    - เลือก Channel **ao/ao0** และ **ao/ao1**
    - ตั้ง Output Value 5V
    - กดปุ่ม Update 
:::
::::

## $V_{OS}$ measurement: NI-9239 {.smaller}
:::: {.columns}
::: {.column width=50%}
![AI](figs/Instr_01_NI_9239_TestPanel.jpg)\
:::
::: {.column width=50%}
#### Voltage range: ±10V
1. เปิด Test Panel ของ NI-9239 จาก NI MAX
2. ตั้งโหมดการวัดแรงดัน
    - เลือก Channel **ai/ai0**
    - ตั้งโหมด **Finite**, อัตราสุ่มวัด **1000 Hz**, จำนวนข้อมูล **10 ค่า**
    - ตั้งย่านการวัด -10V ถึง +10V
    - กดปุ่ม Start

#### เลิกใช้งาน
1. ปิดหน้าต่าง Test Panel
:::
::::