// Plain-language notes for beginners, keyed by setting name.
// w = what it means, t = practical tip. Settings without a note fall back to the official description.
window.GUIDE = {
  // ---------- Motor config: limits ----------
  l_current_max: { w: "The most current the controller will push through the motor. Current is torque, so this is how hard the board can push you forward or hold the nose up.", t: "Balance boards need a high value here. If it is too low the board runs out of torque on hills or hard acceleration, and the nose drops." },
  l_current_min: { w: "The most braking current the motor can use. It is negative because braking runs current the other way.", t: "Usually the same size as Motor Current Max. Too low and the board can't stop you hard enough on steep downhills." },
  l_abs_current_max: { w: "A hard safety limit. If the motor current ever spikes above this, the controller faults and cuts power instantly.", t: "Keep it at your controller's rating and well above Motor Current Max. A cut at speed is a nosedive, so this should only trip for a real fault." },
  l_in_current_max: { w: "The most current the controller may draw from the battery. Motor current can be higher than battery current at low speed, so this mostly limits you at higher speeds and when climbing fast.", t: "Set this to what your pack can safely deliver. Packs with one cell per group (1p) need a lower value. The pev.dev guide suggests 50 A for RS50 cells." },
  l_in_current_min: { w: "The most current pushed back into the battery when braking or riding downhill (regenerative braking).", t: "Too much regen on a full battery can push cells over their maximum voltage. The pev.dev guide suggests about -35 A for RS50 cells." },
  l_slow_abs_current: { w: "When on, the absolute current limit uses a filtered current reading, so short spikes don't trip it.", t: "Leave as set by your controller preset." },
  l_max_duty: { w: "Duty cycle is how much of the battery voltage the controller is using. 100% means it has no headroom left to speed the motor up. This is the hard ceiling.", t: "95% is the usual safe maximum. When you reach it the board can't push harder to keep you balanced, which can cause a nosedive. Refloat's duty pushback warns you well before this." },
  l_min_duty: { w: "The smallest duty cycle the controller will use before switching off the output.", t: "Leave at default." },
  l_min_vin: { w: "The lowest input voltage the controller will run at. Below this it shuts off.", t: "This is a hardware safety limit, not your empty-battery setting. Use Battery Cutoff Start and End for that." },
  l_max_vin: { w: "The highest input voltage the controller will run at. Above this it shuts off to protect itself.", t: "Must be above your fully charged pack voltage, including regen spikes, and within the controller's rating." },
  l_battery_cut_start: { w: "The battery voltage where the controller starts reducing power to protect a nearly empty pack.", t: "Usually cell count × about 2.7–3.0 V. Power fades gradually between Start and End, which feels like the board getting weaker." },
  l_battery_cut_end: { w: "The battery voltage where power is fully cut.", t: "Usually cell count × about 2.5–2.7 V. Riding into this is dangerous on a balance board. Refloat's low-voltage pushback should warn you first." },
  l_battery_regen_cut_start: { w: "Battery voltage where regenerative braking starts being reduced, to avoid overcharging a full pack.", t: "Should be a little below your full-charge voltage." },
  l_battery_regen_cut_end: { w: "Battery voltage where regenerative braking is fully stopped.", t: "Should be at or slightly below your cells' maximum voltage × cell count." },
  l_max_erpm: { w: "Maximum forward speed in electrical RPM (motor RPM × number of pole pairs).", t: "Very large values like 100000 mean there is no speed limit here." },
  l_min_erpm: { w: "Maximum reverse speed in electrical RPM.", t: "Very large negative values mean no limit." },
  l_erpm_start: { w: "The fraction of the ERPM limit where current starts being reduced.", t: "Only matters if you use an ERPM limit." },
  l_temp_fet_start: { w: "Controller temperature where it starts reducing power to protect itself.", t: "On a balance board, losing power is dangerous. Ride gently and let it cool if you get near this." },
  l_temp_fet_end: { w: "Controller temperature where power is cut completely.", t: "Treat this as an emergency limit, not a normal operating point." },
  l_temp_motor_start: { w: "Motor temperature where power starts being reduced.", t: "Hub motors heat up on long climbs and with heavy riders. Needs a working motor temperature sensor." },
  l_temp_motor_end: { w: "Motor temperature where power is cut completely.", t: "Stay well below this. Magnets and windings can be damaged by heat." },
  l_temp_accel_dec: { w: "How much the acceleration current limit is reduced compared with braking current as temperature rises.", t: "Leave at default unless you know why you're changing it." },
  l_watt_max: { w: "Maximum power from the battery, in watts.", t: "Huge values like 1,500,000 mean this limit is effectively off and current limits do the work." },
  l_watt_min: { w: "Maximum regenerative power back into the battery, in watts.", t: "Huge negative values mean this limit is effectively off." },
  l_current_max_scale: { w: "Scales Motor Current Max down by a percentage.", t: "100% means no scaling." },
  l_current_min_scale: { w: "Scales Motor Current Min (braking) down by a percentage.", t: "100% means no scaling." },
  l_in_current_map_start: { w: "Advanced: where input current mapping starts. Used to smooth how battery current is limited.", t: "Leave at default." },
  l_in_current_map_filter: { w: "Advanced: filtering for the input current map.", t: "Leave at default." },

  // ---------- Motor config: general ----------
  motor_type: { w: "How the controller drives the motor. FOC (field oriented control) is smooth and quiet and is what every balance board uses.", t: "Keep this on FOC." },
  m_invert_direction: { w: "Flips which way the motor spins for 'forward'.", t: "Set during setup so the nose is the front. Changing it later reverses the board." },
  pwm_mode: { w: "Switching mode for BLDC (non-FOC) control.", t: "Not used with FOC." },
  comm_mode: { w: "Commutation mode for BLDC (non-FOC) control.", t: "Not used with FOC." },
  sensor_mode: { w: "Sensor mode for BLDC (non-FOC) control.", t: "Not used with FOC. The FOC sensor setting is 'Sensor Mode' in the FOC section." },
  m_sensor_port_mode: { w: "What kind of sensor is wired to the sensor port.", t: "Usually Hall sensors on a balance board motor." },

  // ---------- Motor config: FOC ----------
  foc_sensor_mode: { w: "How the controller knows where the motor's magnets are. Hall sensors are small position sensors inside the motor that give smooth control at very low speed. Sensorless works out the position from the motor's electrical signals.", t: "Balance boards use Hall sensors (or HFI) so starting and slow riding are smooth. The controller switches to sensorless above the Hall switch speed." },
  foc_motor_r: { w: "Motor resistance, measured by the motor detection wizard.", t: "Don't type this in by hand. If you change motors, run motor detection again." },
  foc_motor_l: { w: "Motor inductance, measured by the motor detection wizard.", t: "Don't type this in by hand. Rerun detection if the motor changes." },
  foc_motor_ld_lq_diff: { w: "Difference between the motor's two inductance axes, measured by detection.", t: "Leave as detected." },
  foc_motor_flux_linkage: { w: "How strongly the motor's magnets link with its windings. It sets how fast the motor spins per volt: lower flux linkage means faster but less torque per amp.", t: "Measured by detection. It is why a high-speed winding (like SuperFlux HS) is faster than a high-torque one (HT) on the same battery." },
  foc_current_kp: { w: "How aggressively the controller corrects motor current errors (proportional gain of the current loop).", t: "Calculated by motor detection. Leave it unless you know what you're doing." },
  foc_current_ki: { w: "How the controller removes long-term motor current errors (integral gain of the current loop).", t: "Calculated by motor detection." },
  foc_f_zv: { w: "Switching frequency: how many times per second the controller switches the motor phases.", t: "Higher is smoother and quieter but makes the controller hotter. JetFleet recommends 30 kHz for its controllers." },
  foc_observer_gain: { w: "How strongly the sensorless position estimate (the observer) corrects itself.", t: "Calculated from motor detection." },
  foc_observer_type: { w: "Which maths the controller uses to estimate motor position without sensors.", t: "Use what your controller preset recommends. JetFleet recommends MXLemming Lambda Comp." },
  foc_sl_erpm: { w: "Speed (electrical RPM) where the controller fully switches from Hall sensors to sensorless.", t: "JetFleet recommends 2500 ERPM." },
  foc_sl_erpm_start: { w: "Speed where the controller starts blending from Hall sensors to sensorless.", t: "JetFleet recommends 2000 ERPM (0.8 × the full switch speed)." },
  hall_sl_erpm: { w: "Speed where Hall sensor control hands over to sensorless control.", t: "Usually matches the FOC sensorless switch speed." },
  foc_temp_comp: { w: "Adjusts the motor resistance value as the motor warms up, since resistance rises with temperature.", t: "Keep it on if you have a motor temperature sensor." },
  foc_temp_comp_base_temp: { w: "The temperature the motor resistance was measured at.", t: "Leave as detected." },
  foc_sat_comp_mode: { w: "Saturation compensation: corrects for the motor behaving differently at very high current.", t: "Advanced. Leave on what your preset or motor guide says." },
  foc_sat_comp: { w: "Strength of saturation compensation.", t: "Advanced. Leave at the preset value." },
  foc_cc_decoupling: { w: "Advanced current-control mode that separates the two current axes at high speed.", t: "Leave at default." },
  foc_short_ls_on_zero_duty: { w: "Shorts the low-side switches when the motor is commanded to zero, which holds the motor rather than letting it freewheel.", t: "JetFleet recommends enabling it." },
  foc_overmod_factor: { w: "Overmodulation lets the controller squeeze a little more voltage out of the battery by distorting the drive waveform. It gives about 5–10% more top speed and changes how duty cycle readings scale.", t: "1.00 means off. It's an advanced, at-your-own-risk feature. If you use it, lower your duty pushback to match (see the pev.dev overmodulation guide)." },
  foc_fw_current_max: { w: "Field weakening: extra current that lets the motor spin faster than your battery voltage would normally allow. It can add around 30% top speed on lower-voltage boards.", t: "0 means off. It uses extra battery current. High-voltage boards rarely need it. More than about 50 A has caused problems for riders." },
  foc_fw_duty_start: { w: "Duty cycle where field weakening starts to mix in.", t: "Common values are 50–70%." },
  foc_fw_ramp_time: { w: "How long field weakening takes to fade in.", t: "Too short can feel twitchy as it kicks in. Too long can hold back power in sudden surges. 200–800 ms is typical." },
  foc_fw_q_current_factor: { w: "Advanced field weakening parameter.", t: "The pev.dev guides say don't touch this." },
  foc_hall_interp_erpm: { w: "Below this speed the controller smooths between Hall sensor steps.", t: "Leave at default." },
  foc_phase_filter_max_erpm: { w: "Speed below which the phase voltage filters are used, if your controller has them.", t: "Leave at default." },

  // ---------- Motor config: info ----------
  si_motor_poles: { w: "Number of magnet poles in the motor. Used to convert motor electrical RPM into wheel speed.", t: "Most balance board hub motors have 30. Wrong values give wrong speed readings." },
  si_wheel_diameter: { w: "Tyre diameter in metres. Used only for the speed and distance shown in apps.", t: "If your speed reading is off, measure your tyre and fix this. It doesn't change how the board rides." },
  si_gear_ratio: { w: "Motor-to-wheel gear ratio.", t: "Hub motors are 1." },
  si_battery_cells: { w: "Number of cells in series (the 's' in 32s). Used for battery percentage and voltage-per-cell displays.", t: "Must match your pack, or battery % and some warnings are wrong." },
  si_battery_ah: { w: "Battery capacity in amp-hours, used for range estimates.", t: "For a 1p pack this is one cell's capacity, for example 5 Ah for RS50 cells." },
  si_battery_type: { w: "Battery chemistry, used to turn voltage into a percentage.", t: "Most packs are Li-ion 3.0–4.2 V." },
  bms_type: { w: "Which battery management system (BMS) the controller talks to.", t: "Set if your BMS reports data to the VESC." },

  // ---------- App config ----------
  app_to_use: { w: "Which built-in input app the controller runs (remote, ADC, UART and so on).", t: "With Refloat installed, the balance logic runs from the package, so this is usually set to UART or none per your setup guide." },
  controller_id: { w: "This controller's ID on the CAN bus, the internal network linking the controller to things like a VESC Express Bluetooth module.", t: "Each device on the bus needs a unique ID. Yours is likely 100." },
  can_baud_rate: { w: "Speed of the CAN bus between the controller and other modules.", t: "All devices on the bus must use the same rate." },
  shutdown_mode: { w: "How and when the controller turns itself off.", t: "Depends on your power switch hardware." },
  "imu_conf.type": { w: "Which motion sensor (IMU) the controller uses to sense tilt.", t: "Usually the controller's built-in IMU." },
  "imu_conf.sample_rate_hz": { w: "How many times per second the tilt sensor is read.", t: "Higher gives Refloat fresher angle data. Float Hub uses 832 Hz for the JetFleet F6." },
  "imu_conf.mode": { w: "Which filter combines the gyro and accelerometer into an angle.", t: "Leave as set by your setup." },
  "imu_conf.rot_roll": { w: "Tells the controller how it is mounted (roll rotation), so 'level' is really level.", t: "Set during setup to match how the controller sits in the board." },
  "imu_conf.rot_pitch": { w: "Mounting rotation around the pitch axis.", t: "Set during setup to match how the controller sits in the board." },
  "imu_conf.rot_yaw": { w: "Mounting rotation around the yaw axis.", t: "Set during setup to match how the controller sits in the board." },
  "imu_conf.accel_confidence_decay": { w: "How much the angle filter distrusts the accelerometer during bumps and acceleration.", t: "Leave at default; Refloat has its own angle filter settings." },
  "imu_conf.mahony_kp": { w: "Firmware-level angle filter strength.", t: "Refloat uses its own Mahony settings in the Tune tab." },

  // ---------- Refloat: Tune ----------
  kp: { w: "Angle P: the main balance stiffness. It sets how hard the board pushes back for each degree the nose is off level.", t: "Higher feels tighter and more responsive. Too high causes vibration or shaking. Change it in small steps." },
  kp2: { w: "Rate P: damping. It reacts to how fast the board is tipping, which smooths the ride and stops wobble.", t: "Too low feels loose and bouncy; too high can buzz." },
  ki: { w: "Angle I: slowly adds correction when the nose stays off level for a while, such as on a long hill.", t: "Too high makes the board feel bouncy or delayed. Small values like 0.005–0.03 are common." },
  ki_limit: { w: "Caps how much current Angle I can add, in amps.", t: "Stops Angle I from building up too much correction." },
  mahony_kp: { w: "How quickly Refloat's angle filter trusts the accelerometer over the gyro for pitch. This affects how the board reads its angle over bumps.", t: "Lower values ignore bumps more but react slower to real angle changes." },
  mahony_kp_roll: { w: "The same angle filter setting for roll (side-to-side tilt).", t: "Usually matches the pitch value." },
  kp_brake: { w: "Scales Angle P while braking. Below 1 makes braking softer; above 1 makes it stiffer.", t: "1 means braking feels the same as accelerating." },
  kp2_brake: { w: "Scales Rate P while braking.", t: "1 means no change while braking." },
  booster_angle: { w: "Acceleration booster: how far the nose must dip before extra current is added.", t: "Booster gives extra punch when you lean hard into acceleration." },
  booster_ramp: { w: "Degrees beyond the booster angle over which the booster fades in to full strength.", t: "Smaller ramps make the boost kick in more suddenly." },
  booster_current: { w: "Extra current (amps) the booster adds at full strength when accelerating.", t: "More gives a punchier take-off. 0 turns the booster off." },
  brkbooster_angle: { w: "Brake booster: how far the tail must dip before extra braking current is added.", t: "Helps hard stops feel firm." },
  brkbooster_ramp: { w: "Degrees beyond the brake booster angle over which it fades in.", t: "" },
  brkbooster_current: { w: "Extra braking current (amps) the brake booster adds at full strength.", t: "More makes hard braking feel stronger." },

  // ---------- Refloat: Tune modifiers ----------
  tiltback_constant: { w: "A fixed nose-up angle applied once you're moving.", t: "Some riders like a slight nose lift for comfort. 0 means off." },
  tiltback_constant_erpm: { w: "Speed (ERPM) where the constant nose lift starts.", t: "" },
  tiltback_variable: { w: "Nose lift that grows with speed, in degrees per 1000 ERPM.", t: "Gives a natural feel of the nose rising as you go faster." },
  tiltback_variable_max: { w: "The most nose lift that speed-based tilt can add.", t: "0 means no limit is applied here." },
  tiltback_variable_erpm: { w: "Speed where speed-based nose lift starts.", t: "" },
  noseangling_speed: { w: "How fast (degrees per second) nose angle changes from these features are applied.", t: "Slower feels smoother; faster feels more immediate." },
  torquetilt_strength: { w: "Torque tilt: lifts the nose based on how much current the motor is using, such as when climbing or accelerating. This keeps the nose from feeling like it's dropping under load.", t: "Can be used with ATR or on its own. Higher values lift the nose more under load." },
  torquetilt_strength_regen: { w: "Torque tilt while braking or going downhill (regen current).", t: "" },
  torquetilt_start_current: { w: "Motor current (amps) needed before torque tilt starts.", t: "Stops small current changes from moving the nose." },
  torquetilt_angle_limit: { w: "The most nose lift torque tilt can add, in degrees.", t: "" },
  turntilt_strength: { w: "Turn tilt: lifts the nose during turns, so you keep speed and don't drop the nose in carves.", t: "0 means off." },
  turntilt_angle_limit: { w: "The most nose lift turn tilt can add.", t: "" },
  turntilt_start_angle: { w: "How much you need to be turning before turn tilt starts.", t: "" },
  turntilt_start_erpm: { w: "Minimum speed for turn tilt.", t: "Avoids nose lift during slow manoeuvring." },
  turntilt_erpm_boost: { w: "Extra turn tilt at higher speed, as a percentage.", t: "" },
  turntilt_erpm_boost_end: { w: "Speed at which the turn tilt speed boost reaches its full value.", t: "" },
  turntilt_yaw_aggregate: { w: "How much turning has to build up before turn tilt kicks in. It helps ignore quick wiggles.", t: "" },

  // ---------- Refloat: ATR ----------
  atr_strength_up: { w: "ATR (Adaptive Torque Response) uphill strength. ATR compares how hard the motor is working with how fast you're actually speeding up. When you're climbing or pushing into a headwind, it lifts the nose so the board feels level and keeps power in reserve.", t: "Higher gives more nose lift on hills and hard acceleration." },
  atr_strength_down: { w: "ATR downhill strength: lowers the nose when going downhill, so you feel the slope and the board brakes more naturally.", t: "Higher drops the nose more on descents." },
  atr_threshold_up: { w: "How much uphill load is ignored before ATR responds.", t: "Higher thresholds make ATR ignore small bumps and gentle slopes." },
  atr_threshold_down: { w: "How much downhill load is ignored before ATR responds.", t: "" },
  atr_speed_boost: { w: "Makes ATR stronger at higher speeds.", t: "" },
  atr_angle_limit: { w: "The most nose angle ATR can add, in degrees.", t: "" },
  atr_amps_accel_ratio: { w: "How many amps your board needs to accelerate by a given amount. ATR uses it to tell normal acceleration from climbing.", t: "Depends on rider weight and board. Leave at default unless a tuning guide says otherwise." },
  atr_amps_decel_ratio: { w: "The same as above, for braking.", t: "" },
  atr_filter: { w: "Smoothing applied to ATR's acceleration reading.", t: "" },
  "atr.transition_boost": { w: "Speeds up ATR's response when switching between uphill and downhill.", t: "" },
  braketilt_strength: { w: "Brake tilt: tilts the board while braking to give you more leverage to stop.", t: "0 means off." },
  braketilt_lingering: { w: "How long the brake tilt stays after you stop braking.", t: "" },

  // ---------- Refloat: Startup ----------
  startup_pitch_tolerance: { w: "How level the board must be (in degrees, front to back) before it will engage.", t: "Larger values let you start from a less level position." },
  startup_roll_tolerance: { w: "How level the board must be side to side before it engages.", t: "" },
  startup_speed: { w: "How fast (degrees per second) the board brings itself level after engaging.", t: "Higher snaps up quicker; lower is gentler." },
  startup_click_current: { w: "A short current pulse on engage and disengage, which you feel as a click.", t: "0 means off. It's just a feel/feedback thing." },
  startup_simplestart_enabled: { w: "Simple start: engage as soon as both foot sensors are pressed, without needing to level the board first.", t: "" },
  startup_pushstart_enabled: { w: "Push start: engage by pushing the board along.", t: "" },
  startup_dirtylandings_enabled: { w: "Dirty landings: lets the board engage after a jump even if it isn't perfectly level.", t: "" },
  parking_brake_mode: { w: "When the board holds itself in place while you're stopped on it.", t: "" },
  brake_current: { w: "Current used to hold the board still when stopped.", t: "" },

  // ---------- Refloat: Stop ----------
  fault_pitch: { w: "If the board tilts past this angle front to back, the motor disengages (for example when you fall off).", t: "" },
  fault_roll: { w: "If the board tilts past this angle side to side, the motor disengages.", t: "" },
  fault_delay_pitch: { w: "How long (milliseconds) the board must be past the pitch angle before disengaging.", t: "" },
  fault_delay_roll: { w: "How long the board must be past the roll angle before disengaging.", t: "" },
  fault_delay_switch_half: { w: "How long (milliseconds) after lifting one side of the foot sensor before the board disengages at low speed.", t: "This is how you step off: lift a heel, the board stops." },
  fault_delay_switch_full: { w: "How long after both sides of the foot sensor are released before the board disengages.", t: "Too short and a bump that lifts your foot can cut power." },
  fault_adc_half_erpm: { w: "Below this speed, lifting one side of the foot sensor disengages the board. Above it, a half-lift is ignored so you can't cut power by accident at speed.", t: "" },
  fault_is_dual_switch: { w: "Treats the two foot sensor halves as separate switches, so either one alone keeps the board running.", t: "" },
  fault_moving_fault_disabled: { w: "Prevents disengaging while moving fast, even if foot sensors are released.", t: "Safer for bumps but the board can roll away if you fall. Use with care." },
  enable_quickstop: { w: "Quick stop: disengages quickly at very low speed when the nose is pitched up.", t: "" },
  fault_darkride_enabled: { w: "Darkride: lets you ride the board upside down.", t: "" },
  fault_reversestop_enabled: { w: "Reverse stop: stop by rolling backwards a little.", t: "" },

  // ---------- Refloat: Pushback alerts ----------
  tiltback_duty: { w: "Duty pushback: when the motor reaches this duty cycle, the nose lifts to slow you down. This is your warning that you're close to the board's power limit.", t: "80% is a common safe choice. Never ride through it, as the next step is running out of headroom and a possible nosedive." },
  tiltback_duty_angle: { w: "How far the nose lifts for duty pushback.", t: "" },
  tiltback_duty_speed: { w: "How quickly the nose lifts for duty pushback.", t: "" },
  tiltback_speed: { w: "Speed pushback: lift the nose at this speed.", t: "0 means off." },
  tiltback_return_speed: { w: "How fast the nose returns to level after a pushback ends.", t: "" },
  is_dutybeep_enabled: { w: "Beep when duty pushback starts (needs a beeper).", t: "" },
  persistent_fatal_error: { w: "Keeps the board in pushback after a serious fault until restart.", t: "" },
  tiltback_hv_angle: { w: "How far the nose lifts when the battery voltage is too high, such as regen on a full pack.", t: "" },
  tiltback_hv_speed: { w: "How quickly the high-voltage pushback lifts the nose.", t: "" },
  tiltback_lv_angle: { w: "How far the nose lifts when the battery is getting low.", t: "Your warning to stop riding before the battery cuts out." },
  tiltback_lv_speed: { w: "How quickly the low-voltage pushback lifts the nose.", t: "" },

  // ---------- Refloat: Specs ----------
  tiltback_hv: { w: "Per-cell voltage where high-voltage pushback starts.", t: "Usually about 4.2–4.3 V per cell." },
  tiltback_lv: { w: "Per-cell voltage where low-voltage pushback starts.", t: "Set it above your Battery Cutoff Start (per cell) so you get warned before power fades." },
  fault_adc1: { w: "Voltage on the first foot sensor input that counts as 'foot on'.", t: "" },
  fault_adc2: { w: "Voltage on the second foot sensor input that counts as 'foot on'.", t: "" },
  hardware_swap_footpad_adcs: { w: "Swaps which foot sensor input is front and back.", t: "" },
  "hardware.swap_footpad_adcs": { w: "Swaps which foot sensor input is front and back.", t: "" },
  is_footbeep_enabled: { w: "Beep when you step off while moving (needs a beeper).", t: "" },
  is_beeper_enabled: { w: "Turns on a connected beeper.", t: "" },
  disabled: { w: "Turns the Refloat package off.", t: "If this is on, the board won't balance." },

  // ---------- Refloat: Haptics ----------
  "haptic.duty.frequency": { w: "Pitch of the buzz played through the motor at duty pushback.", t: "" },
  "haptic.duty.strength": { w: "Strength of the duty pushback buzz.", t: "" },
  "haptic.error.frequency": { w: "Pitch of the buzz for errors such as high or low voltage.", t: "" },
  "haptic.error.strength": { w: "Strength of the error buzz.", t: "" },
  "haptic.duty_solid_offset": { w: "How far above the duty pushback point the buzz becomes continuous.", t: "" },

  // ---------- Refloat: BMS ----------
  "bms.enabled": { w: "Lets Refloat read your battery management system (BMS) and warn you about cell problems.", t: "Recommended if your BMS can report to the VESC, especially on 1p packs." },
  "bms.cell_lv_threshold": { w: "Cell voltage below which Refloat warns about a low cell.", t: "" },
  "bms.cell_hv_threshold": { w: "Cell voltage above which Refloat warns about a high cell.", t: "" },
  "bms.cell_balance_threshold": { w: "Voltage difference between cells that counts as out of balance.", t: "" },
  "bms.cell_ht_threshold": { w: "Cell temperature where Refloat warns it's too hot.", t: "" },
  "bms.cell_lt_threshold": { w: "Cell temperature where Refloat warns it's too cold.", t: "" },
  "bms.bms_ht_threshold": { w: "BMS board temperature where Refloat warns it's too hot.", t: "" },
};

// Notes shown at the top of whole sections.
window.GUIDE_SECTIONS = {
  "Motor/BLDC": "BLDC mode is an older, rougher way to drive motors. Balance boards use FOC, so nothing here is used.",
  "Motor/DC": "Settings for brushed DC motors. Not used on a balance board.",
  "Motor/PID Controllers": "Speed and position control loops for other kinds of vehicles. Refloat does its own balance control, so these aren't used.",
  "Motor/FOC": "FOC (field oriented control) is how the controller drives your motor. Most values here come from motor detection or your controller preset. Field Weakening is the section riders tune for speed.",
  "Motor/General": "Safety limits: how much current, voltage, power and heat the controller allows. These protect the battery, motor and controller.",
  "Motor/Additional Info": "Information used for displays such as speed, distance and battery %. It doesn't change how the board rides.",
  "App/PPM": "Settings for a hobby-style remote receiver. Not used by Refloat.",
  "App/ADC": "Settings for analog throttle inputs. Refloat reads the foot sensors itself, so this is usually unused.",
  "App/UART": "Serial port settings, for things like external Bluetooth modules.",
  "App/VESC Remote": "Settings for a VESC wireless remote.",
  "App/NRF": "Settings for an NRF wireless remote. Usually unused.",
  "App/PAS": "Pedal assist for e-bikes. Not used on a balance board.",
  "App/IMU": "The tilt sensor that tells the board which way it's leaning. Set up once to match how the controller is mounted.",
  "Refloat/Tune": "The core balance feel: how stiff, how damped, and extra boost on acceleration and braking.",
  "Refloat/Tune Modifiers": "Features that change the nose angle while riding: with speed, under load (torque tilt), and in turns.",
  "Refloat/ATR": "Adaptive Torque Response lifts the nose on hills and drops it on descents, so the board feels level and keeps power in reserve.",
  "Refloat/Startup": "How the board engages when you step on.",
  "Refloat/Stop": "When and how the board disengages. These are safety settings.",
  "Refloat/Pushback Alerts": "Warnings that lift the nose to slow you down before you hit a limit. Don't ride through them.",
  "Refloat/Haptic Feedback": "Buzzes played through the motor as warnings.",
  "Refloat/Remote": "Settings for controlling nose angle or throttle with a remote.",
  "Refloat/LEDs": "Light colours and patterns.",
  "Refloat/Specs": "Hardware details: voltage pushback points, foot sensors and LED wiring.",
  "Refloat/BMS": "Battery monitoring through your BMS.",
};
// Beginner notes, part 2: app config and motor info settings.
(() => {
const NU = "Not used on a balance board running Refloat. ";
const ramp = (dir) => ({ w: `How many seconds the input takes to ramp ${dir}. It smooths sudden throttle changes.`, t: NU + "Only matters if you control the motor with this input." });
const expo = { w: "Shapes the throttle response curve. 0 is linear; negative is gentle near zero and stronger at the top; positive is the opposite.", t: NU + "Only affects throttle-style inputs." };
const expoMode = { w: "Which formula shapes the throttle curve (exponential, natural or polynomial).", t: NU + "Only affects throttle-style inputs." };
const multi = { w: "Sends the same commands to other VESCs on the CAN bus, for vehicles with more than one motor.", t: NU + "A one-wheel board has a single motor controller." };
const tc = { w: "Traction control between several motors: reduces power to a wheel that spins faster than the others.", t: NU + "Needs more than one motor." };
const tcDiff = { w: "How big the speed difference between motors must be before traction control fully cuts the faster one.", t: NU };
const coast = { w: "How much braking is applied automatically when you let go of the throttle, as a fraction of full brake current.", t: NU };
const coastRamp = { w: "How long the automatic coasting brake takes to reach full strength.", t: NU };
const safe = { w: "Stops the motor from starting unless the throttle has been at zero first, for example after power-up or a fault.", t: NU + "A safety feature for throttle-controlled vehicles." };
const ctrl = (src) => ({ w: `How the ${src} input controls the motor: off, current (torque), duty cycle (speed-like), or PID speed control, with various reverse and brake options.`, t: NU + "Should be Off, since Refloat controls the motor." });
const hyst = { w: "A dead zone around the input's rest position, so tiny movements are ignored.", t: NU };
const smartRevDuty = { w: "Top duty cycle used when smart reverse drives the vehicle backwards.", t: NU };
const smartRevRamp = { w: "How long smart reverse takes to reach its top duty cycle.", t: NU };
const nrfAddr = { w: "One byte of the wireless address used to pair an NRF remote.", t: NU };
const canRate = (n) => ({ w: `How many times per second the controller broadcasts status message group ${n} on the CAN bus. Other devices, like a VESC Express or a display, read these.`, t: "Leave at default unless a connected device or setup guide asks for something else." });
const canMsgs = (n) => ({ w: `Which status messages (speed, current, temperatures, voltage and so on) are sent at CAN rate ${n}.`, t: "Leave at default unless a connected device needs specific messages." });
const lp = (axis) => ({ w: `Smooths the accelerometer's ${axis} axis reading by filtering out vibration above this frequency. 0 turns the filter off.`, t: "Refloat has its own angle filtering. Leave at default unless a tuning guide says otherwise." });
const aoff = (axis) => ({ w: `Calibration offset for the accelerometer's ${axis} axis, set when the IMU is calibrated.`, t: "Set by the calibration process. Don't type values in by hand." });
const goff = (axis) => ({ w: `Calibration offset (drift correction) for the gyro's ${axis} axis.`, t: "Set by calibration. If the board's level drifts, recalibrate rather than editing this." });
const adcV = (what, n) => ({ w: `The voltage on ADC${n} that counts as the ${what} of the throttle range.`, t: NU + "Refloat reads the foot sensors itself; its foot-sensor thresholds are in the Refloat Specs section." });

Object.assign(window.GUIDE, {
  // ADC app
  "app_adc_conf.ctrl_type": ctrl("ADC (analog throttle)"),
  "app_adc_conf.use_filter": { w: "Smooths the analog input to remove electrical noise, at the cost of a tiny delay.", t: NU },
  "app_adc_conf.safe_start": safe,
  "app_adc_conf.update_rate_hz": { w: "How many times per second the analog input is read.", t: NU },
  "app_adc_conf.ramp_time_pos": ramp("up"), "app_adc_conf.ramp_time_neg": ramp("back down"),
  "app_adc_conf.buttons": { w: "Turns on cruise control and reverse buttons for the analog throttle app, and sets whether they're inverted.", t: NU },
  "app_adc_conf.multi_esc": multi, "app_adc_conf.tc": tc, "app_adc_conf.tc_max_diff": tcDiff,
  "app_adc_conf.coast_brake_level": coast, "app_adc_conf.coast_brake_ramp_time": coastRamp,
  "app_adc_conf.hyst": hyst,
  "app_adc_conf.voltage_start": adcV("start", 1), "app_adc_conf.voltage_end": adcV("end", 1), "app_adc_conf.voltage_center": adcV("centre", 1),
  "app_adc_conf.voltage_inverted": { w: "Flips the ADC1 input, so high voltage means low throttle.", t: NU },
  "app_adc_conf.voltage_min": { w: "Lowest valid voltage on ADC1. Below this the input is treated as faulty and the motor stops.", t: NU },
  "app_adc_conf.voltage_max": { w: "Highest valid voltage on ADC1. Above this the input is treated as faulty and the motor stops.", t: NU },
  "app_adc_conf.voltage2_start": adcV("start", 2), "app_adc_conf.voltage2_end": adcV("end", 2),
  "app_adc_conf.voltage2_inverted": { w: "Flips the ADC2 input.", t: NU },
  "app_adc_conf.throttle_exp": expo, "app_adc_conf.throttle_exp_brake": { ...expo, w: "Shapes the brake response curve. 0 is linear." }, "app_adc_conf.throttle_exp_mode": expoMode,

  // General
  timeout_msec: { w: "If the controller gets no input for this long, it switches the motor off. This is a safety net if a remote or input disconnects.", t: "Refloat manages its own control loop. Leave at default." },
  timeout_brake_current: { w: "Braking current applied after an input timeout.", t: "Leave at default." },
  pairing_done: { w: "When on, only phones or computers that have been paired with this controller can connect over Bluetooth.", t: "A simple way to stop other people connecting to your board." },
  permanent_uart_enabled: { w: "Turns on the always-on serial port some controllers have for a Bluetooth module.", t: "Turn off only if you want to block Bluetooth access through that port." },
  can_mode: { w: "Which protocol the CAN bus uses. VESC mode lets VESC Tool and the VESC Express reach the controller over CAN.", t: "Keep on VESC. Other modes would break the link through your VESC Express." },
  uavcan_esc_index: { w: "This motor's index in UAVCAN messages (a drone protocol).", t: "Only used in UAVCAN mode." },
  uavcan_raw_mode: { w: "How raw UAVCAN throttle commands are interpreted.", t: "Only used in UAVCAN mode." },
  uavcan_raw_rpm_max: { w: "Top speed (ERPM) for UAVCAN RPM commands.", t: "Only used in UAVCAN mode." },
  uavcan_status_current_mode: { w: "Which current (motor or battery) is reported in UAVCAN status messages.", t: "Only used in UAVCAN mode." },
  servo_out_enable: { w: "Uses the PPM port to output a servo signal instead.", t: NU },
  kill_sw_mode: { w: "Sets an input that acts as an emergency stop switch.", t: "Usually Disabled on a balance board. A kill switch cutting power at speed would cause a nosedive." },
  can_status_rate_1: canRate(1), can_status_msgs_r1: canMsgs(1), can_status_rate_2: canRate(2), can_status_msgs_r2: canMsgs(2),

  // IMU
  "imu_conf.use_magnetometer": { w: "Uses a compass sensor, if the IMU has one, to help with heading.", t: "Not needed for balancing. Usually off." },
  "imu_conf.filter": { w: "The IMU chip's own built-in filtering level for accelerometer and gyro readings.", t: "Leave as your setup guide recommends." },
  "imu_conf.accel_lowpass_filter_x": lp("X"), "imu_conf.accel_lowpass_filter_y": lp("Y"), "imu_conf.accel_lowpass_filter_z": lp("Z"),
  "imu_conf.gyro_lowpass_filter": { w: "Smooths gyro readings on all three axes by filtering out vibration above this frequency. 0 turns it off.", t: "Leave at default unless a tuning guide says otherwise." },
  "imu_conf.mahony_ki": { w: "Lets the firmware's angle filter slowly cancel out gyro drift.", t: "Refloat uses its own angle filter. Leave at default." },
  "imu_conf.madgwick_beta": { w: "Strength setting for the Madgwick angle filter, if that filter is selected.", t: "Only used in Madgwick mode." },
  "imu_conf.accel_offsets__0": aoff("X"), "imu_conf.accel_offsets__1": aoff("Y"), "imu_conf.accel_offsets__2": aoff("Z"),
  "imu_conf.gyro_offsets__0": goff("X"), "imu_conf.gyro_offsets__1": goff("Y"), "imu_conf.gyro_offsets__2": goff("Z"),

  // NRF
  "app_nrf_conf.power": { w: "Transmit power of the NRF radio for wireless remotes.", t: NU },
  "app_nrf_conf.speed": { w: "Data rate of the NRF radio link.", t: NU },
  "app_nrf_conf.channel": { w: "Radio channel used by the NRF remote link.", t: NU },
  "app_nrf_conf.crc_type": { w: "Error checking used on NRF radio packets.", t: NU },
  "app_nrf_conf.send_crc_ack": { w: "Sends an acknowledgement when a valid radio packet arrives.", t: NU },
  "app_nrf_conf.retry_delay": { w: "Wait time before resending an unacknowledged radio packet.", t: NU },
  "app_nrf_conf.retries": { w: "How many times an unacknowledged radio packet is resent.", t: NU },
  "app_nrf_conf.address__0": nrfAddr, "app_nrf_conf.address__1": nrfAddr, "app_nrf_conf.address__2": nrfAddr,

  // PAS
  "app_pas_conf.ctrl_type": { w: "Pedal assist mode for e-bikes: off, assist based on pedalling speed, or constant assist while pedalling.", t: NU },
  "app_pas_conf.sensor_type": { w: "Type of pedal sensor.", t: NU },
  "app_pas_conf.pedal_rpm_start": { w: "Pedalling speed where assist starts.", t: NU },
  "app_pas_conf.pedal_rpm_end": { w: "Pedalling speed where assist reaches its maximum.", t: NU },
  "app_pas_conf.invert_pedal_direction": { w: "Flips which pedal direction counts as forward.", t: NU },
  "app_pas_conf.magnets": { w: "Number of magnets on the pedal sensor.", t: NU },
  "app_pas_conf.use_filter": { w: "Smooths the pedal sensor signal.", t: NU },
  "app_pas_conf.current_scaling": { w: "Maximum pedal assist, as a share of the motor's current limit.", t: NU },
  "app_pas_conf.ramp_time_pos": ramp("up"), "app_pas_conf.ramp_time_neg": ramp("back down"),
  "app_pas_conf.update_rate_hz": { w: "How often the pedal assist control runs.", t: NU },

  // PPM
  "app_ppm_conf.ctrl_type": ctrl("PPM (hobby remote receiver)"),
  "app_ppm_conf.median_filter": { w: "Filters out glitchy pulses from the remote receiver.", t: NU },
  "app_ppm_conf.safe_start": safe,
  "app_ppm_conf.pid_max_erpm": { w: "Top speed (ERPM) at full stick in PID speed mode.", t: NU },
  "app_ppm_conf.ramp_time_pos": ramp("up"), "app_ppm_conf.ramp_time_neg": ramp("back down"),
  "app_ppm_conf.max_erpm_for_dir": { w: "Below this speed, braking twice switches to reverse.", t: NU },
  "app_ppm_conf.smart_rev_max_duty": smartRevDuty, "app_ppm_conf.smart_rev_ramp_time": smartRevRamp,
  "app_ppm_conf.multi_esc": multi, "app_ppm_conf.tc": tc, "app_ppm_conf.tc_max_diff": tcDiff,
  "app_ppm_conf.pulse_start": { w: "Shortest pulse from the receiver, meaning minimum stick.", t: NU },
  "app_ppm_conf.pulse_end": { w: "Longest pulse from the receiver, meaning maximum stick.", t: NU },
  "app_ppm_conf.pulse_center": { w: "Pulse length when the stick is centred.", t: NU },
  "app_ppm_conf.hyst": hyst,
  "app_ppm_conf.throttle_exp": expo, "app_ppm_conf.throttle_exp_brake": { ...expo, w: "Shapes the brake response curve. 0 is linear." }, "app_ppm_conf.throttle_exp_mode": expoMode,

  // UART
  app_uart_baudrate: { w: "Speed of the serial (UART) link, used by some Bluetooth modules and accessories.", t: "Must match whatever is plugged into the UART port." },

  // VESC Remote
  "app_chuk_conf.ctrl_type": ctrl("VESC Remote / Nunchuk"),
  "app_chuk_conf.ramp_time_pos": ramp("up"), "app_chuk_conf.ramp_time_neg": ramp("back down"),
  "app_chuk_conf.stick_erpm_per_s_in_cc": { w: "How fast cruise control speed changes when you push the stick.", t: NU },
  "app_chuk_conf.hyst": hyst,
  "app_chuk_conf.use_smart_rev": { w: "Holding full brake at very low speed switches to driving backwards, so you can stop on a slope.", t: NU },
  "app_chuk_conf.smart_rev_max_duty": smartRevDuty, "app_chuk_conf.smart_rev_ramp_time": smartRevRamp,
  "app_chuk_conf.multi_esc": multi, "app_chuk_conf.tc": tc, "app_chuk_conf.tc_max_diff": tcDiff,
  "app_chuk_conf.coast_brake_level": coast, "app_chuk_conf.coast_brake_ramp_time": coastRamp,
  "app_chuk_conf.throttle_exp": expo, "app_chuk_conf.throttle_exp_brake": { ...expo, w: "Shapes the brake response curve. 0 is linear." }, "app_chuk_conf.throttle_exp_mode": expoMode,

  // Motor info
  motor_brand: { w: "Motor brand, for your own records.", t: "Doesn't affect riding." },
  motor_model: { w: "Motor model, for your own records.", t: "Doesn't affect riding." },
  motor_weight: { w: "Motor weight in grams, for your records and comparisons.", t: "Doesn't affect riding." },
  motor_sensor_type: { w: "Which position sensor the motor has, for your records.", t: "Doesn't change how the motor is driven. That's the FOC Sensor Mode setting." },
  motor_quality_bearings: { w: "Your rating of the motor's bearings, for records only.", t: "Doesn't affect riding." },
  motor_quality_magnets: { w: "Your rating of the motor's magnets, for records only.", t: "Doesn't affect riding." },
  motor_quality_construction: { w: "Your rating of the motor's build quality, for records only.", t: "Doesn't affect riding." },
  si_motor_nl_current: { w: "Current the motor draws spinning with no load. Used by VESC Tool's motor comparison tool.", t: "Doesn't affect riding." },
});
})();
// Beginner notes, part 3: remaining motor config settings.
(() => {
const NU = "Not used on a balance board, which drives the motor with FOC. ";
const DET = "Set by motor detection or your controller preset. Leave it unless a guide for your motor says otherwise.";
const hall = (i) => ({ w: `Entry ${i} of the Hall sensor table: it maps one Hall sensor reading to a motor position. The table is filled in by Hall sensor detection.`, t: "Don't edit by hand. Rerun detection if you change or rewire the motor." });
const bldcHall = (i) => ({ w: `Entry ${i} of the BLDC-mode Hall sensor table.`, t: NU });
const offI = (i) => ({ w: `Calibration offset for current sensor ${i}, so 0 A reads as 0 A.`, t: "Measured automatically by offset calibration. Don't edit by hand." });
const offV = (i) => ({ w: `Calibration offset for phase voltage sensor ${i}.`, t: "Measured automatically by offset calibration. Don't edit by hand." });
const offVu = (i) => ({ w: `Calibration offset for phase voltage sensor ${i} while the motor isn't being driven.`, t: "Measured automatically by offset calibration. Don't edit by hand." });
const enc = { t: "Only used with an encoder. Balance board motors use Hall sensors." };
const sp = (w) => ({ w, t: "Only used in speed control (PID speed) mode. Refloat controls current directly, so this isn't used." });
const pp = (w) => ({ w, t: "Only used in position control mode. Not used on a balance board." });
const hfi = (w) => ({ w, t: "Only used when the sensor mode is HFI (sensorless control at standstill). Balance boards normally use Hall sensors." });
const ol = (w) => ({ w, t: "Only used when starting a motor without sensors. With Hall sensors these rarely matter." });

Object.assign(window.GUIDE, {
  // BLDC
  sl_min_erpm: { w: "In BLDC mode, the speed below which the motor runs without position feedback.", t: NU },
  sl_min_erpm_cycle_int_limit: { w: "A BLDC sensorless tuning value used at low speed.", t: NU },
  sl_bemf_coupling_k: { w: "A BLDC sensorless tuning value that helps the motor start.", t: NU },
  sl_cycle_int_limit: { w: "A BLDC sensorless timing value that decides when to switch to the next motor phase.", t: NU },
  sl_phase_advance_at_br: { w: "BLDC timing advance at high speed.", t: NU },
  sl_cycle_int_rpm_br: { w: "Speed where BLDC timing advance reaches its maximum.", t: NU },
  l_max_erpm_fbrake: { w: "Highest speed where a full brake is allowed in BLDC mode.", t: NU },
  l_max_erpm_fbrake_cc: { w: "Highest speed where full braking is allowed in current control (BLDC).", t: NU },
  cc_gain: { w: "Current controller gain in BLDC and DC modes.", t: NU },
  cc_ramp_step_max: { w: "Fastest allowed duty cycle change in BLDC/DC current control.", t: NU },
  m_duty_ramp_step: { w: "Fastest allowed duty cycle change for BLDC and DC motors.", t: NU },
  m_current_backoff_gain: { w: "How strongly BLDC/DC duty cycle mode reduces current to stay within limits.", t: NU },
  m_bldc_f_sw_min: { w: "Lowest switching frequency in BLDC mode.", t: NU },
  m_bldc_f_sw_max: { w: "Highest switching frequency in BLDC mode.", t: NU },
  cc_startup_boost_duty: { w: "Minimum duty cycle used in BLDC current control, for more punch from a stop.", t: NU },
  hall_table__0: bldcHall(0), hall_table__1: bldcHall(1), hall_table__2: bldcHall(2), hall_table__3: bldcHall(3),
  hall_table__4: bldcHall(4), hall_table__5: bldcHall(5), hall_table__6: bldcHall(6), hall_table__7: bldcHall(7),
  m_dc_f_sw: { w: "Switching frequency for brushed DC motors.", t: "Not used on a balance board." },

  // FOC advanced
  foc_dt_us: { w: "Corrects for a tiny built-in delay when the controller's switches change over. It mainly smooths very low speed running.", t: DET },
  foc_pll_kp: { w: "How quickly the speed estimate follows changes in motor position (proportional gain).", t: DET },
  foc_pll_ki: { w: "How the speed estimate removes long-term error (integral gain).", t: DET },
  foc_duty_dowmramp_kp: { w: "Controls current spikes when duty cycle is reduced in duty cycle mode.", t: "Leave at default." },
  foc_duty_dowmramp_ki: { w: "Second gain for the duty cycle down-ramp controller.", t: "Leave at default." },
  foc_control_sample_mode: { w: "How often within each switching cycle the controller measures current and runs its control loop.", t: "Leave as your controller preset sets it." },
  foc_current_sample_mode: { w: "Which current sensors are used for each measurement. It affects noise at high duty cycle.", t: "JetFleet recommends Longest Zero Time on firmware 6.06 and newer, and All Sensors Combined on 6.05." },
  foc_observer_gain_slow: { w: "Scales the observer gain down at low duty cycle to help track the motor at low speed.", t: DET },
  foc_current_filter_const: { w: "Smoothing on the current reading used by the slow absolute current limit. Lower is smoother and slower.", t: "Leave at default." },
  foc_d_gain_scale_start: { w: "Duty cycle where one of the current controller's gains starts being reduced, for stability near full duty.", t: "Leave at default." },
  foc_d_gain_scale_max_mod: { w: "How much that current controller gain is reduced at maximum duty cycle.", t: "Leave at default." },
  foc_mtpa_mode: { w: "Maximum torque per amp: a trick that gets more torque from some motor types. Hub motors on boards don't benefit much.", t: "Usually Disabled on balance boards." },
  foc_observer_offset: { w: "Corrects the observer's timing lag at high speed.", t: "Leave at default." },
  foc_speed_soure: { w: "Where the speed estimate gets its position from: the combined sensor position, or the sensorless observer.", t: "Leave at default." },
  foc_mag_vd_max: { w: "Limits how much voltage one axis of the current controller can take, keeping headroom for torque at full duty.", t: "Leave at default." },
  foc_encoder_offset: { w: "Encoder zero point relative to the motor.", ...enc },
  foc_encoder_ratio: { w: "How many motor electrical turns per encoder turn.", ...enc },
  foc_encoder_inverted: { w: "Set if the encoder counts backwards.", ...enc },
  foc_fw_backoff: { w: "A safety gain that reduces field weakening if it asks for more than the controller can deliver, preventing a runaway.", t: "Leave at default." },
  foc_phase_filter_enable: { w: "Uses dedicated hardware filters to measure the motor's phase voltages directly, if the controller has them. This helps sensorless tracking.", t: "Leave as your controller preset sets it." },
  foc_phase_filter_disable_fault: { w: "Turns off the fault that triggers when the phase filters give unexpected readings.", t: "Only for troubleshooting false faults." },

  // HFI
  foc_hfi_samples: hfi("How many HFI measurements are taken per motor revolution."),
  foc_hfi_voltage_start: hfi("Test voltage used at start-up to find which way the motor is facing."),
  foc_hfi_voltage_run: hfi("Test voltage injected while running at low speed to track motor position."),
  foc_hfi_voltage_max: hfi("Test voltage used at maximum current."),
  foc_hfi_gain: hfi("How strongly HFI corrects its position estimate."),
  foc_hfi_max_err: hfi("Largest position error HFI will correct in one step."),
  foc_hfi_hyst: hfi("Current threshold where HFI changes its injection pattern."),
  foc_sl_erpm_hfi: hfi("Speed below which HFI is used."),
  foc_hfi_start_samples: hfi("Number of measurements taken at start-up to find the motor direction."),
  foc_hfi_obs_ovr_sec: hfi("How long the sensorless observer keeps control after dropping into HFI range."),
  foc_hfi_amb_mode: hfi("Method used at start-up to work out which way the motor is facing."),
  foc_hfi_amb_current: hfi("Current used by the direction-finding pulse."),
  foc_hfi_amb_tres: hfi("Threshold for the direction-finding pulse."),
  foc_hfi_reset_erpm: hfi("Speed below which HFI repeats its direction finding."),

  // Hall
  foc_hall_table__0: hall(0), foc_hall_table__1: hall(1), foc_hall_table__2: hall(2), foc_hall_table__3: hall(3),
  foc_hall_table__4: hall(4), foc_hall_table__5: hall(5), foc_hall_table__6: hall(6), foc_hall_table__7: hall(7),
  m_hall_extra_samples: { w: "Reads the Hall sensors several extra times and picks the middle value, to reject electrical noise.", t: "Higher rejects more noise but limits the switching frequency. Leave at default unless you get Hall noise." },

  // Offsets
  foc_offsets_cal_on_boot: { w: "Recalibrates the current and voltage sensors every time the controller starts.", t: "Keep on. Make sure the wheel isn't spinning when you power on." },
  foc_offsets_cal_mode: { w: "When and how sensor offset calibration runs.", t: "Leave at default." },
  foc_offsets_current__0: offI(0), foc_offsets_current__1: offI(1), foc_offsets_current__2: offI(2),
  foc_offsets_voltage__0: offV(0), foc_offsets_voltage__1: offV(1), foc_offsets_voltage__2: offV(2),
  foc_offsets_voltage_undriven__0: offVu(0), foc_offsets_voltage_undriven__1: offVu(1), foc_offsets_voltage_undriven__2: offVu(2),

  // Sensorless start
  foc_openloop_rpm: ol("Below this speed a sensorless motor is spun without position feedback until the observer can track it."),
  foc_openloop_rpm_low: ol("Open-loop speed used at low current, as a fraction of the main open-loop speed."),
  foc_sl_openloop_hyst: ol("How long the speed must stay low before the controller drops back into open loop."),
  foc_sl_openloop_time_lock: ol("How long the motor is held still at the start of an open-loop start."),
  foc_sl_openloop_time_ramp: ol("How long the open-loop start takes to ramp up speed."),
  foc_sl_openloop_time: ol("How long the controller stays in open loop after the ramp."),
  foc_sl_openloop_boost_q: ol("Extra current during an open-loop start to get past the motor's cogging."),
  foc_sl_openloop_max_q: ol("Current limit during an open-loop start. Negative means no limit."),
  foc_start_curr_dec: ol("Reduces the current limit at start-up so the observer can lock on. It reduces starting torque."),
  foc_start_curr_dec_rpm: ol("Speed above which full current is available again."),
  foc_hall_interp_erpm: { w: "Below this speed the controller smooths between Hall sensor steps.", t: "Leave at default." },

  // General advanced
  cc_min_current: { w: "The smallest current the controller will command. Requests below this let the motor freewheel.", t: "Leave at default." },
  m_fault_stop_time_ms: { w: "How long the motor stays off after a fault before it can run again.", t: "Leave at default." },
  m_out_aux_mode: { w: "What the controller's auxiliary output does (for example switching a fan or relay on at a temperature).", t: "Only matters if something is wired to the AUX output." },
  l_duty_start: { w: "Duty cycle where the controller starts gently reducing current near top speed. 100% means it doesn't.", t: "Lower values soften the approach to the duty limit but cost top speed. Refloat's duty pushback is the usual warning instead." },
  l_additional_faults: { w: "Extra fault checks you can turn on, such as overspeed or encoder slip.", t: "Leave at default unless you know you need one." },
  l_erpm_abs_overspeed: { w: "Speed limit for the absolute overspeed fault, if that fault is enabled.", t: "A fault at speed is a nosedive. Only use with care." },

  // BMS (motor config)
  "bms.type": { w: "Whether a VESC BMS on the CAN bus reports battery data to this controller.", t: "Set to VESC BMS only if you have one." },
  "bms.limit_mode": { w: "Which BMS readings (temperature, charge level, cell voltages) can reduce motor current.", t: "Only works with a VESC BMS." },
  "bms.t_limit_start": { w: "Battery temperature where current starts being reduced.", t: "Only works with a VESC BMS." },
  "bms.t_limit_end": { w: "Battery temperature where current is cut.", t: "Only works with a VESC BMS." },
  "bms.soc_limit_start": { w: "Battery charge level where current starts being reduced.", t: "Only works with a VESC BMS." },
  "bms.soc_limit_end": { w: "Battery charge level where current is cut.", t: "Only works with a VESC BMS." },
  "bms.vmin_limit_start": { w: "Lowest cell voltage where current starts being reduced.", t: "Only works with a VESC BMS." },
  "bms.vmin_limit_end": { w: "Lowest cell voltage where current is cut.", t: "Only works with a VESC BMS." },
  "bms.vmax_limit_start": { w: "Highest cell voltage where regen braking starts being reduced.", t: "Only works with a VESC BMS." },
  "bms.vmax_limit_end": { w: "Highest cell voltage where regen braking is cut.", t: "Only works with a VESC BMS." },
  "bms.fwd_can_mode": { w: "Passes BMS messages from the CAN bus on to a connected app.", t: "Leave at default." },

  // Current / sensors / temperature / voltage
  m_drv8301_oc_mode: { w: "Over-current protection mode for controllers with a DRV8301 driver chip.", t: "Only matters on DRV8301 hardware." },
  m_drv8301_oc_adj: { w: "Over-current threshold for DRV8301 driver chips.", t: "Only matters on DRV8301 hardware." },
  l_in_current_max_scale: { w: "Scales Battery Current Max down by a percentage.", t: "100% means no scaling." },
  l_in_current_min_scale: { w: "Scales Battery Current Min (regen) down by a percentage.", t: "100% means no scaling." },
  m_encoder_counts: { w: "Resolution of an encoder, if one is fitted.", ...enc },
  m_encoder_sin_amp: { w: "Sine signal amplitude of a sin/cos encoder.", ...enc },
  m_encoder_cos_amp: { w: "Cosine signal amplitude of a sin/cos encoder.", ...enc },
  m_encoder_sin_offset: { w: "Sine signal offset of a sin/cos encoder.", ...enc },
  m_encoder_cos_offset: { w: "Cosine signal offset of a sin/cos encoder.", ...enc },
  m_encoder_sincos_filter_constant: { w: "Smoothing on a sin/cos encoder signal.", ...enc },
  m_encoder_sincos_phase_correction: { w: "Corrects phase error in a sin/cos encoder.", ...enc },
  m_motor_temp_sens_type: { w: "Type of temperature sensor inside the motor, so temperatures read correctly.", t: "Must match your motor. A wrong type gives wrong motor temperatures, and thermal limits won't protect it." },
  m_ntc_motor_beta: { w: "Calibration value (beta) for the motor's NTC temperature sensor.", t: "Use the value from your motor's spec." },
  m_ptc_motor_coeff: { w: "Calibration value for a PTC motor temperature sensor.", t: "Only used with PTC sensors." },
  m_ntcx_ptcx_res: { w: "Resistance of a custom motor temperature sensor.", t: "Only used with a custom sensor type." },
  m_ntcx_ptcx_temp_base: { w: "Reference temperature for a custom motor temperature sensor.", t: "Only used with a custom sensor type." },
  m_batt_filter_const: { w: "How much the battery level reading is smoothed, so it doesn't jump around when you accelerate.", t: "Higher is steadier but slower to update." },

  // PID controllers
  sp_pid_loop_rate: { w: "How often the speed and position controllers run.", t: "Not used by Refloat." },
  s_pid_kp: sp("Speed controller proportional gain."),
  s_pid_ki: sp("Speed controller integral gain."),
  s_pid_kd: sp("Speed controller derivative gain."),
  s_pid_kd_filter: sp("Smoothing on the speed controller's derivative term."),
  s_pid_min_erpm: sp("Speed below which the speed controller switches off."),
  s_pid_allow_braking: sp("Lets the speed controller brake to hold a speed."),
  s_pid_ramp_erpms_s: sp("How fast the speed target is allowed to change."),
  s_pid_speed_source: sp("Which speed estimate the speed controller uses."),
  p_pid_kp: pp("Position controller proportional gain."),
  p_pid_ki: pp("Position controller integral gain."),
  p_pid_kd: pp("Position controller derivative gain."),
  p_pid_kd_proc: pp("Position controller derivative gain applied to the measured position."),
  p_pid_kd_filter: pp("Smoothing on the position controller's derivative term."),
  p_pid_ang_div: pp("Maps one control turn to several motor turns."),
  p_pid_gain_dec_angle: pp("Reduces position gains when close to the target."),
  p_pid_offset: pp("Angle offset for the position controller."),
});
})();
// Beginner notes, part 4: remaining Refloat settings.
(() => {
const tc = (f) => ({ w: `How smoothly ${f} moves the nose: the time it takes to get most of the way to its new angle. Lower reacts faster; higher feels smoother.`, t: "Too low can feel jerky; too high can feel slow and vague." });
const onTc = (f) => ({ w: `How smoothly ${f} speeds up when moving the nose further from level.`, t: "Higher is gentler; lower is snappier." });
const offTc = (f) => ({ w: `How smoothly ${f} speeds up when bringing the nose back to level.`, t: "Higher is gentler; lower is snappier." });
const onLim = (f) => ({ w: `The fastest ${f} can tilt the nose, in degrees per second.`, t: "Lower values make the nose move more gently." });
const offLim = (f) => ({ w: `The fastest ${f} can bring the nose back to level, in degrees per second.`, t: "" });
const RB = "Changes need a board restart. ";
const strip = (s) => ({
  [`hardware.leds.${s}.order`]: { w: `Where the ${s} LED strip sits in the LED chain (first, second, third), or Not Present if you don't have one.`, t: RB + "Must match how your strips are wired." },
  [`hardware.leds.${s}.count`]: { w: `Number of LEDs on the ${s} strip.`, t: RB + "Must match your strip, or the lights will look wrong." },
  [`hardware.leds.${s}.color_order`]: { w: `The colour order your ${s} LED strip expects (GRB, RGB and so on). It depends on the LED chip.`, t: "If colours look wrong (red shows as green, for example), try another order." },
  [`hardware.leds.${s}.reverse`]: { w: `Flips the direction of the ${s} LED strip.`, t: RB + "Use if animations or the status bar run the wrong way." },
});
const look = (s, label, extra = "") => ({
  [`leds.${s}.mode`]: { w: `The light effect used for the ${label}${extra}.`, t: "" },
  [`leds.${s}.brightness`]: { w: `Brightness of the ${label}${extra}.`, t: "Very low brightness can make LEDs lose colour or switch off." },
  [`leds.${s}.color1`]: { w: `Main colour for the ${label}.`, t: "'White (full)' is brightest but uses the most power." },
  [`leds.${s}.color2`]: { w: `Second colour for the ${label}, used by animated effects.`, t: "" },
  [`leds.${s}.speed`]: { w: `Animation speed for the ${label}.`, t: "" },
});

Object.assign(window.GUIDE, {
  "atr.filter.time_constant": tc("ATR"), "atr.filter.on_speed_time_constant": onTc("ATR"), "atr.filter.off_speed_time_constant": offTc("ATR"),
  "atr.filter.on_speed_limit": onLim("ATR"), "atr.filter.off_speed_limit": offLim("ATR"),
  "torque_tilt.filter.time_constant": tc("torque tilt"), "torque_tilt.filter.on_speed_time_constant": onTc("torque tilt"), "torque_tilt.filter.off_speed_time_constant": offTc("torque tilt"),
  "torque_tilt.filter.on_speed_limit": onLim("torque tilt"), "torque_tilt.filter.off_speed_limit": offLim("torque tilt"),
  "turn_tilt.filter.time_constant": tc("turn tilt"),
  "remote.filter.time_constant": tc("remote tilt"),

  "haptic.vibrate.frequency": { w: "How fast the motor vibrates for warning and error haptics.", t: "" },
  "haptic.vibrate.strength": { w: "Maximum strength of the vibration haptic, in amps. 0 turns vibration off.", t: "Strength grows with speed up to Maximum Strength Speed." },
  "haptic.current_threshold": { w: "Plays a solid warning tone when motor or battery current goes above this share of your limits. 0 turns it off.", t: "A handy warning that you're near your current limits." },
  "haptic.min_strength": { w: "How strong haptic feedback is at a standstill, as a share of its full strength.", t: "" },
  "haptic.max_strength_speed": { w: "Speed at which haptic feedback reaches full strength.", t: "" },
  "haptic.strength_curvature": { w: "How haptic strength grows with speed. 0 is a straight line; higher stays gentle at low speed and ramps up faster at high speed.", t: "" },

  inputtilt_remote_type: { w: "How a handheld remote connects to the controller (PPM, UART or none). Used for remote tilt and remote throttle.", t: "Leave on None if you don't use a remote." },
  inputtilt_angle_limit: { w: "Maximum nose angle the remote can set. Half throttle gives half this angle.", t: "" },
  inputtilt_invert_throttle: { w: "Flips which way the remote throttle tilts the nose.", t: "" },
  inputtilt_deadband: { w: "A dead zone around the remote's centre, so a stick that doesn't fully re-centre doesn't tilt the nose.", t: "" },
  "remote.max_move_speed": { w: "Top speed when using a remote (or the app) to move the board without riding it.", t: "0 turns remote moving off." },
  remote_throttle_grace_period: { w: "After the board disengages, remote throttle is blocked for this many seconds.", t: "Keep it above 0 so remote tilt can't accidentally drive the board as you step off." },

  "leds.on": { w: "Turns all Refloat-controlled LEDs on or off.", t: "Can also be toggled from the Refloat app tab until the next restart." },
  "leds.headlights_on": { w: "Turns headlights and taillights on. They switch ends when you change riding direction.", t: "" },
  "leds.headlights_transition": { w: "Animation used when headlights turn on or off as you engage.", t: "" },
  "leds.direction_transition": { w: "Animation used when headlights and taillights swap ends as you change direction.", t: "" },
  "leds.lights_off_when_lifted": { w: "Turns the front and rear lights off when you lift the nose up to carry the board.", t: "Saves you from LEDs shining in your eyes." },
  "leds.status_on_front_when_lifted": { w: "Shows the status bar on the front strip when you lift the nose.", t: "" },
  ...look("front", "front strip", " when headlights are off"),
  ...look("rear", "rear strip", " when headlights are off"),
  ...look("headlights", "headlights"),
  ...look("taillights", "taillights"),
  ...look("status_idle", "status bar idle animation"),
  "leds.status.brightness_headlights_off": { w: "Status bar brightness in the daytime (headlights off).", t: "High so you can read it in sunlight." },
  "leds.status.brightness_headlights_on": { w: "Status bar brightness at night (headlights on).", t: "Low so it doesn't dazzle you." },
  "leds.status.show_sensors_while_running": { w: "Shows the blue foot sensor indicators on the status bar while riding, if a sensor is released.", t: "" },
  "leds.status.motor_utilization_threshold": { w: "When motor load (the highest of duty cycle and current use) goes above this, the status bar shows load instead of battery.", t: "" },
  "leds.status.red_bar_percentage": { w: "Point where the status bar turns red (low battery or high load).", t: "" },
  "leds.status.idle_timeout": { w: "Seconds before the status bar switches to its idle animation. 0 turns idle off.", t: "" },

  "hardware.leds.mode": { w: "Who drives the LEDs: Refloat itself (Internal), a separate light module (External), both, or nobody (Off).", t: "" },
  "hardware.leds.pin": { w: "Which controller pin the LED strip data wire is connected to.", t: RB + "Depends on your controller model." },
  "hardware.leds.pin_config": { w: "Whether the LED pin uses a pull-up to 5 V. It depends on your controller.", t: RB + "The Refloat description lists which controllers need which." },
  ...strip("status"), ...strip("front"), ...strip("rear"),

  "meta.is_default": { w: "An internal flag that marks the config as freshly reset to defaults. Used by Refloat's auto-backup.", t: "Not a riding setting." },
});
})();
Object.assign(window.GUIDE, {
  sl_max_fullbreak_current_dir_change: { w: "In BLDC mode, the most braking current allowed while the motor changes direction.", t: "Not used on a balance board, which drives the motor with FOC." },
  motor_description: { w: "Free-text notes about the motor, for your own records.", t: "Doesn't affect riding." },
  motor_quality_description: { w: "Free-text notes about the motor's quality, for your own records.", t: "Doesn't affect riding." },
});
