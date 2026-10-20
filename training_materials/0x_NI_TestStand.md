## NI TestStand, why? {.smaller}


## TestStand Sequence Editor {.smaller}

## Trying TestStand {.smaller}
Login -> Open File Demos -> Mobile Device Test

Scope - LabVIEW - LabWindows/CVI - ... - Python

Insertion Pallete

Tests
    - Pass/Fail Test -> boolean
    - Numeric Limit Test -> numbers
    - Multiple Numeric Limit Test -> array of number
    - String Value Test -> string

## Steps test {.smaller}

Power On Test -> Step Settings

Sequences -> Variables / Sequences (reusable blocks)
    - เช่น RF Test ไปใช้งานอื่น
    - SequenceFileLoad แสดงข้อความ

## Test Sequence Terminology {.smaller}

- Sequence = ลำดับขั้นตอน
- Sequence File = รวมหลาย sequence
- Parameter

## TestStand {.smaller}
ปุ่มกด *
เลือก MainSequence

แนวคิด cleanup -> rollback / failsafe

Insertion Pallete -> Message Popup -> Message Expression (ต้องมี "") -> Button Options ผูกปุ่ม 
ปุ่ม -> Run MainSequence (ไม่ล็อกผล) 
-> SinglePass / Test UUTs -> มีล็อกผล
Ctrl + D -> ปิดหน้าต่างผล

## TestStand &larr; Code Module {.smaller}
- req for LabVIEW
- req for MATLAB
- req for Python

## TestStand {.smaller}
Insertion Palette -> Action ตั้งชื่อ ControlDelay 
Step Settings -> VI Path -> Add Path ใน search directory
แสดง Parameter ของ VI 
** ข้อควรระวังของ Express VI
** ข้อควรระวังของ Cluster -> Typedef

Parameter -> Code Module -> Variables -> Step.Result.<DataType>

Run -> Breakpoint ดูผล

## Test data: variables
Locals -> scope in Sequence
Parameters -> ส่งผ่านข้อมูลแบบ by reference
FileGlobals -> scope in same *.seq file
StationGlobals -> scope แบบเห็นทั้งเครื่อง

Add new sequence -> InsertPalette (SequenceCall) -> Current File -> call SubSequence -> Add Parameters

InsertPalette -> Statement ใช้ Parameters แบบ by reference
โค้ด Parameters.Out = Parameters.Inp + 1 
แล้วกำหนดตัวแปรภาครับ Locals.X ไปรับค่าจาก Parameters.Out
Breakpoint - Step

## Test data:
Flow Control - If ... End, Sweep loop (สแกนตามย่าน)


## Step -> on Event
Step -> Properties
Post Actions - On Pass หรือ On Fail (เลือก Terminate Execution / หลีกเลี่ยง Break ตอน production -> ซอฟต์แวร์ค้าง)

## Step 
Precondition 
    xx
    xx
    xx
        PostAction

Process Model callback -> มีตัวหลักคือ MainSequence

Precondition -> Precondition builder -> เลือกเงื่อนไขว่า บาง cond ต้อง PASS

## Process Model
Single Pass -> ทดลอง run
Test UUTs -> วน DUT

Sequence File Callback -> MainSequence (บังคับ) Process Setup / Process Cleanup 


## Batch model + Parallel model
Sequence -> Sequence File Properties -> Advanced -> Required Specific Model -> เลือก batch / parallel model
Configure -> Station Model -> 2