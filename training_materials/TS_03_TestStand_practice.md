## LM321 specification {.smaller}

![LM321](figs/TS_03_LM321_spec.jpg)\


## $I_{S}$ measurement {.smaller}

:::: {.columns}
::: {.column width=50%}
1. **UDP3305S**: จ่ายไฟเลี้ยง CH1(15V)/CH2(15V)
2. **UT8805E**: วัดกระแส DC ย่าน 20 mA
:::
::: {.column width=50%}
3. **NI-9477**: คุมสวิทช์ S7
4. **NI-9269**: จ่ายไฟเลี้ยง AO0(5V)/AO1(5V)
:::
::::
![IS](figs/Instr_01_IS_meas.jpg)\

## TestStand practice: $I_{S}$ measurement {.smaller}

| Group | Code modules | Function | Variables | 
| :- | :- | :---- | :-- |
| **Setup** | `pps_connect` <br> `dmm_connect` <br> `switch_init` <br> `ao_init` | เชื่อมต่อ UDP3305S <br> เชื่อมต่อ UT8805E <br> เชื่อมต่อ NI-9477 <br> เชื่อมต่อ NI-9269 | &rarr; `FG.ppsRef`^[VISA/DAQmx resource เป็น [`LabVIEWIOControl` type](https://knowledge.ni.com/KnowledgeArticleDetails?id=kA03q000000YGp8CAG&l=en-TH)] <br> &rarr; `FG.dmmRef`^[LC คือ Locals, FG คือ FileGlobals, SG คือ StationGlobals] <br> &rarr; `FG.switchRef` <br> &rarr; `FG.aoRef` | 
| **Main** | `pps_ctrl` <br> `switch_ctrl` <br> `ao_update` <br> Numeric Limit Test (`dmm_read`) | จ่ายไฟเลี้ยง ±15V ให้ AUX <br> เปิดสวิทช์ S7 <br> จ่ายไฟเลี้ยง ±5V ให้ DUT <br> ทดสอบ $I_{S}$ < 1.2mA |  |
| **Cleanup** |`visa_close` <br> `daqmx_stop` | ปิดการเชื่อมต่อ VISA <br> ปิดการเชื่อมต่อ DAQmx | &larr; ... <br> &larr; ...  |

## TestStand practice {.smaller}
![TestStand](figs/TS_03_TS_IS.jpg)\

## TestStand practice: sequence call {.smaller}

| Group | Code modules | Function | Variables | 
| :- | :-- | :--- | :-- |
| **Setup** | ... | ... | ... |
| **Main** | `pps_ctrl` <br> `ao_update` <br> Call `I_S_test` | จ่ายไฟเลี้ยง ±15V ให้ AUX <br> จ่ายไฟเลี้ยง ±5V ให้ DUT <br> ทดสอบ $I_{S}$ < 1.2mA | ... |
| **Cleanup** | ... | ... | ... |

<br>

:::: {.columns}
::: {.column width=20%}
#### Sub-sequence: "I_S test"
:::
::: {.column width=75%}

::: {style="border: 2px solid black; padding: 10px; display: inline-block;"}

| Group | Code modules | Function | 
| :- | :--- | :--- |
| **Setup** | `switch_ctrl` | เปิดสวิทช์ S7 | 
| **Main** | Numeric Limit Test (`dmm_read`) | ทดสอบ $I_{S}$ < 1.2mA |
| **Cleanup** |`switch_ctrl` | ปิดสวิทช์ S7 | 

:::

:::
::::