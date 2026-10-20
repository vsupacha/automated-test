## Course outline {.smaller}

:::: {.columns}
::: {.column width=50%}
- [ ] **วันที่ 1 LabVIEW + myRIO**
    - Automated Test Equipment
    - การเข้าจังหวะและส่งผ่านข้อมูลด้วย LabVIEW 
    - การสร้างสัญญาณทดสอบด้วย NI myRIO
    - **workshop**: การเชื่อมต่อ DUT
- [ ] **วันที่ 2 Instrument drivers**
    - การเชื่อมต่อเครื่องมือวัด
    - ไดรเวอร์ DAQmx และ VISA
    - การวิเคราะห์/บันทึกข้อมูล
    - **workshop**: การเชื่อมต่อและควบคุมเครื่องมือวัด
:::
::: {.column width=50%}
- [x] **วันที่ 3 NI TestStand**
    - NI TestStand
    - Sequence และ action/test steps
    - การใช้งาน code module
    - **workshop**: การสร้าง sequence ทดสอบ
- [ ] **วันที่ 4 Testing in electronics industry**
    - กรณีศึกษาของการทดสอบในอุตสาหกรรม
    - **workshop**: LabVIEW + TestStand for opamp testing
:::
::::

## Workshop outcomes {.smaller}
1. เข้าใจหลักการพื้นฐานของ sequence, step, adapter
2. เข้าใจการสร้าง Test Sequence ด้วย NI TestStand 
3. สร้าง TestStand Sequence เพื่อการวัด $I_{S}$ ของ DUT opamp

    | Group | Function |
    | - | --- |
    | **Setup** | - เชื่อมต่อ UDP3305S / UT8805E / NI-9269 / NI-9477 |
    | **Main** | - สร้างไฟเลี้ยง AUX opamp ±15V <br> - เปิดสวิทช์ S7 <br> - สร้างไฟเลี้ยง DUT opamp ±5V <br> - **ทดสอบกระแสไม่เกิน 1.2 mA**
    | **Cleanup** | - ปิดไฟเลี้ยง DUT opamp <br> - ปิดไฟเลี้ยง AUX opamp <br> - ปิดสวิทช์ S7 <br> - ยกเลิก DAQmx/VISA |
