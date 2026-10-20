## Electronics manufacturing flow {.smaller .scrollable}

![ElecProcess](figs/ATE_01_elec_process.jpg)\

## Automated Test Equipment (ATE) {.smaller}
Computer-controlled systems that automatically measure and evaluate functional, structural, or electrical performance on electronic devices

- Goals: **Usability** / **Reusability** / **Maintainability** / **Scalability**

:::: {.columns}
::: {.column width=67%}
![NI ATE](figs/ATE_01_structure.jpg)\
:::
::: {.column width=33%}
#### [NI STS](https://www.ni.com/en/shop/electronic-test-instrumentation/what-is-the-semiconductor-test-system.html): Semiconductor Test System

![NI ATE](figs/ATE_01_NI_STS.jpg)\
:::
::::

## ATE for semiconductor products {.smaller}
:::: {.columns}
::: {.column width=45%}
#### [TERADYNE ETS-800](https://www.teradyne.com/products/ets-800/)
![ETS-800](figs/ATE_01_teradyne_ets800.jpg)\
:::
::: {.column width=55%}
#### ETS-800 D20: Two sectors, 20-slots
- HSD-64: 64 digital channels
    - 200 MValue/sec
    - -2V to +12V, 32mA PPMU
- APU-32A: floating 32 low-power VI channels
    - 30V to +80V, 200mA VI
- SPU-8112: floating 8 high power VI channels
    - &plusmn;100V, 2A DC
- QMS: 4 differential digitizer
    - 12-bit at 10 Msps, &plusmn;200V floating
- MCMUX: 64-channel MUX 
    - 200V, 2A
:::
::::

## ATE for PCB products^[[Understanding Bare Board PCB Testing](https://resources.pcb.cadence.com/blog/2022-understanding-bare-board-pcb-testing)] {.smaller}

:::: {.columns}
::: {.column width=45%}
#### Automated Optical Inspection (AOI)

![PCB AOI](figs/ATE_01_PCB_AOI.jpg)\

:::
::: {.column width=55%}
#### Electrical testing &rarr; ICT or Flying probe

- Continuity Testing (Short Testing)
- Insulation Resistance Testing
- Impedance Testing: Time-domain reflectometry (TDR)

![PCB Elec](figs/ATE_01_PCB_ELEC.jpg)\
:::
::::

## ATE for PCBA products^[[What Is PCBA Testing? Complete Guide to Inspection Methods, Process, and Quality Control](https://jlcpcb.com/blog/pcba-testing)] {.smaller}

:::: {.columns}
::: {.column width=50%}
#### Automated Optical Inspection (AOI)
![X-Ray PCBA](figs/ATE_01_PCBA_AOI.jpg){width=80%}\

#### PCB X-Ray Inspection
![X-Ray PCBA](figs/ATE_01_PCBA_XRAY.jpg){width=80%}\
:::
::: {.column width=50%}
#### Electrical testing
- Flying Probe Test (FPT) &rarr; PCB trace, component values
- In-Circuit Testing (ICT) &rarr; electrical signals at test points
- Functional Testing (FCT)
![PCBA FCT](figs/ATE_01_PCBA_FCT.jpg)\
:::
::::

## ATE for appliance products {.smaller}
**Requirements** &larr; Safety/Energy efficiency/Endurance/... standards 

![Appliance](figs/ATE_01_Appliance.jpg){width=75%}\

## Semiconductor terminology {.smaller}

:::: {.columns}
::: {.column width=32%}
- DUT (Device Under Test) / UUT (Unit Under Test) อุปกรณ์ที่ถูกทดสอบ
- DPS (Device Power Supplies) แหล่งจ่ายไฟเลี้ยงให้ DUT
- PMU (Parametric Measurement Unit) อุปกรณ์สำหรับวัด DC characteristics ของ DUT
- PPMU (Per Pin Measurement Unit) PMU ที่ต่อกับขาของ DUT
:::
::: {.column width=32%}
- DIB (Device Interface Board) / Load Board ส่วนเชื่อมต่อกับ DUT
- HANDLER อุปกรณ์หยิบจับชิป (Die) ใส่ซ็อคเก็ต
- PIB (Probe Interface Board) โพรบที่เชื่อมต่อเวเฟอร์
- Probe Card แผงวงจรที่ต่อกับโพรบ
- PROBER อุปกรณ์เลื่อนชิป (Die) ไปที่โพรบ
:::
::: {.column width=32%}
- VCC (+ ICC) ไฟเลี้ยง TTL
- VDD (+ IDD) ไฟเลี้ยง CMOS
- VSS ทางกลับของไฟเลี้ยง
- VIH / VIL แรงดันเข้าสำหรับ logic 1 / 0
- VOH / VOL แรงดันออกสำหรับ logic 1 / 0
- IOH / IOL กระแส source / sink สำหรับ logic 1 / 0
- IIH / IIL กระแส leakage สำหรับ logic 1 / 0
- IOZH / IOZL กระแส leakage ในสถานะ high-Z สำหรับ logic 1 / 0
:::
::::

## Digital logics vs electrical signals {.smaller}

:::: {.columns}
::: {.column width=70%}
![Dig V](figs/ATE_01_digital_v.jpg)\
:::
::: {.column width=30%}
![Dig V](figs/ATE_01_digital_i.jpg)\
:::
::::

:::: {.columns}
::: {.column width=40%}
| Logic | Voltage | 
| -- | ---- |
| Out = 1 | $V_O$ > $V_{OH}$ |
| Out = 0 | $V_O$ < $V_{OL}$ |
| In = 1 | $V_I$ > $V_{IH}$ | 
| In = 0 | $V_I$ < $V_{IL}$ | 
:::
::: {.column width=60%}
| Logic | Transistor | Voltage |
| -- | -- | ---- |
| Out = 1 | OFF | $V_{load}$ = $V_{DD} - I_{load} * R$ |
| Out = 0 | ON | $V_{load}$ &cong; 0 = $I_{load} * R$ |
:::
::::

## Semiconductor test concepts {.smaller}

:::: {.columns}
::: {.column width=75%}
#### ATE pin &lrarr; DUT
![ATE I/O](figs/ATE_01_pin_io.jpg)\
:::
::: {.column width=25%}
#### Subsystems:

- Device Power Supply (DPS)
- Reference Voltage Supplies (RVS)
- Parametric Measurement Unit (PMU)

#### Concepts

- Force voltage &rarr; sense current
- Force current &rarr; sense voltage
:::
::::

## Microcontroller pin {.smaller}

#### Multiplexed I/O pin: ESD protection diodes

![MCU pin](figs/ATE_01_MCU_pin.jpg)\

## Open/short test {.smaller}
:::: {.columns}
::: {.column width=50%}
#### Die test: ESD diode
- Force current (เช่น +100 µA) เข้า pin
- Measure voltage: 
    - PASS: ประมาณ 0.6–0.8 V 
    - Short: ใกล้ 0V
    - Open: เพิ่มถึงค่า V limit
![OpenShort](figs/ATE_01_OpenShortI.jpg)\
:::
::: {.column width=50%}
#### PCB/PCBA test
- วัดระหว่าง 2 test point
    - ผลกระทบของ trace, solder, การเชื่อมต่อบน PCB
- Force voltage, measure current &rarr; ความต้านทาน
    - ต่ำมาก = short / สูงมาก = open
![OpenShort](figs/ATE_01_OpenShortV.jpg)\
:::
::::

## Pin electronics^[[Understanding Key Differences between SMUs and PPMUs](https://www.ni.com/en/shop/electronic-test-instrumentation/source-measure-units/what-are-source-measure-units/understanding-key-differences-between-smus-and-ppmus.html)] {.smaller}
:::: {.columns}
::: {.column width=50%}
#### SMU (Source Measure Unit)
- Operating modes:
    - 2 quadrants (source only)
    - 4 quadrants (source and sink)
![SMU](figs/ATE_01_SMU.jpg){width=85%}\
:::
::: {.column width=50%}
#### PPMU (Pin Parametric Measurement Unit)
- Operating modes (2 quadrants):
    - Force voltage, measure current
    - Force current, measure voltage
- Less precision, no programmable limits &rarr; higher speed, and more channels
![PPMU](figs/ATE_01_PPMU.jpg){width=65%}\
:::
::::

## DC parametric test {.smaller}
:::: {.columns}
::: {.column width=20%}
#### IDD testing
:::
::: {.column width=80%}
![IDD](figs/ATE_01_DC_IDD.jpg)\
:::
::::

:::: {.columns}
::: {.column width=20%}
#### VOL/IOL Testing
:::
::: {.column width=80%}
![IOL](figs/ATE_01_DC_IOL.jpg)\
:::
::::

## AC parametric test {.smaller}
![AC](figs/ATE_01_AC_timing.jpg){width=80%}\

## Functional testing: digital DUT {.smaller}
:::: {.columns}
::: {.column width=65%}
![FCT](figs/ATE_01_FCT_test.jpg)\
:::
::: {.column width=35%}
#### Concepts
**Stimulus** &rarr; **DUT** &rarr; **Response**

- Drive digital inputs: **0 / 1**
- Compare outputs: **L / H / Z**
- Verify response at specified **timing**

#### Test vector
timing + input stimulus + expected response

| Time | IN1 | IN2 | OUT |
| ---: | :-: | :-: | :-: |
| $t_0$ | 0 | 0 | L |
| $t_1$ | 0 | 1 | H |
| $t_2$ | 1 | 0 | H |
| $t_3$ | 1 | 1 | Z |
:::
::::

## Die testing &rarr; bin distribution {.smaller .scrollable}

:::: {.columns}
::: {.column width=75%}
![Test Flow](figs/ATE_01_test_flow.jpg)\
:::
::: {.column width=25%}
#### Testing flow

1. Continuity test: Open/Short Test
2. DC parametric test: 
3. Functional test:
4. AC parametric / timing test :

#### Bin distribution

- Bin 01: good device
- Bin 02: okay device
- Bin xx: ??? reject
- ...
:::
::::

## PCBA testing &rarr; PASS/Scrap/Rework {.smaller}

:::: {.columns}
::: {.column width=50%}
![PCBA Test](figs/ATE_01_PCBA.jpg)\
:::
::: {.column width=50%}
#### Testing flow

1. Continuity: Open/Short test
2. Component verification: RLC, diode
3. Power-up verification: VDD &rarr; IDD
4. Functional test:
![PCBA Test](figs/ATE_01_PCBA_pogo.jpg)\
:::
::::
