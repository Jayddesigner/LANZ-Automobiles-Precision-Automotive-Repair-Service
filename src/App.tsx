/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import estimatorCarImg from './assets/images/lanz_estimator_car_1790166411842.jpg';

interface SectionData {
  n: string;
  img: string;
  len: string;
  grad: string;
  spd: string;
  note: string;
}

interface StandardStep {
  id: string;
  stepNum: string;
  title: string;
  copy: string;
  detail: string;
  tag: string;
  subtag: string;
  anchor: {
    x: number;
    y: number;
    label: string;
    sub: string;
  };
  cardPos: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
}

interface EstimatorService {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  laborTime: string;
  parts: string;
  desc: string;
}

interface TestimonialItem {
  id: string;
  quote: string;
  author: string;
  role: string;
  vehicle: string;
  service: string;
  bay: string;
  archiveCode: string;
  metric: string;
  rating: string;
}

interface FaqItem {
  num: string;
  category: string;
  question: string;
  answer: string;
}

interface AthleteRow {
  bib: number;
  name: string;
  nat: string;
  st: [number, string, string, string] | null;
  seed: string;
  start: string;
}

const ASSET_BASE = 'https://cdn.jsdelivr.net/gh/VanhDc/aura-assets@kaltgrat-v1/kaltgrat/';

interface VehicleCategory {
  id: string;
  tag: string;
  counter: string;
  name: string;
  sub: string;
  description: string;
  image: string;
  bays: string;
  specs: { label: string; value: string }[];
  platforms: string[];
}

const VEHICLES: VehicleCategory[] = [
  {
    id: 'cars',
    tag: 'PASSENGER & PERFORMANCE',
    counter: '01',
    name: 'CARS',
    sub: 'Everyday vehicles, performance cars, and luxury vehicles',
    description: 'Precision servicing across European grand tourers, high-performance sports cars, and luxury daily sedans. Factory-certified CAN-bus telemetry, dynamic chassis alignment, and complete engine blueprinting.',
    image: '/service_cars.jpg',
    bays: 'Dedicated Bays 01 · 02 · 03',
    specs: [
      { label: 'PLATFORM FOCUS', value: 'Coupe / Sedan / GT / Hybrid' },
      { label: 'DIAGNOSTIC ARCH.', value: 'CAN-FD, DoIP, FlexRay' },
      { label: 'BENCH TOOLING', value: 'Hunter 3D Hawkeye Elite Dynamic' },
    ],
    platforms: ['Porsche', 'BMW M', 'Audi Sport', 'Mercedes-AMG', 'Lexus', 'Domestic V8'],
  },
  {
    id: 'trucks',
    tag: 'COMMERCIAL & UTILITY',
    counter: '02',
    name: 'PICKUPS & TRUCKS',
    sub: 'Work trucks, utility vehicles, and heavy-duty pickups',
    description: 'Heavy-duty hoists, commercial fleet diagnostics, and severe-duty powertrain maintenance. High-torque driveline overhauls, commercial diesel calibration, and structural load alignment built for maximum uptime.',
    image: '/service_trucks.jpg',
    bays: 'Heavy Hoist Bays 04 · 05 (18,000-lb)',
    specs: [
      { label: 'HOIST CAPACITY', value: '18,000-lb Asymmetric Commercial' },
      { label: 'DIESEL ARCH.', value: 'Duramax, PowerStroke & Cummins HD' },
      { label: 'CHASSIS REINFORCE', value: 'Dually Hubs, Multi-Leaf & Air Springs' },
    ],
    platforms: ['Ford Super Duty', 'Ram 2500/3500 HD', 'GMC Sierra HD', 'Commercial Vans'],
  },
  {
    id: 'motorcycles',
    tag: 'TWO-WHEEL ENGINEERING',
    counter: '03',
    name: 'MOTORCYCLES',
    sub: 'Street bikes, sport bikes, and motorcycles',
    description: 'Dedicated clean-room motorcycle bay equipped with pneumatic bike hoists, inertial dynamometer sweeps, and laser steering head verification. Valve shim adjustment, throttle synchronization, and suspension rebuilds.',
    image: '/service_motorcycles.jpg',
    bays: 'Moto Precision Bay 06',
    specs: [
      { label: 'DISCIPLINES', value: 'Superbike, Naked, ADV, Cruiser & Tourer' },
      { label: 'DYNO TUNING', value: 'Dynojet 250i Inertial Wheel Telemetry' },
      { label: 'DAMPING CALIBRATION', value: 'Öhlins, WP & Showa Cartridge Rebuild' },
    ],
    platforms: ['Ducati', 'BMW Motorrad', 'Yamaha R-Series', 'Honda CBR', 'KTM', 'Harley-Davidson'],
  },
  {
    id: 'specialty',
    tag: 'BESPOKE & RECREATIONAL',
    counter: '04',
    name: 'SPECIALTY VEHICLES',
    sub: 'Additional automotive and recreational vehicles',
    description: 'Tailored mechanical care for vintage collector automobiles, bespoke track day machinery, custom overland rigs, and recreational off-road machines. Custom wiring fabrication, bespoke part machining, and corner weighting.',
    image: '/service_specialty.jpg',
    bays: 'Specialist Bay 07',
    specs: [
      { label: 'VEHICLE TYPES', value: 'Track Day, Overlanding, Vintage Classics' },
      { label: 'CUSTOM FABRICATION', value: 'TIG Inconel, 4-Corner Digital Scales' },
      { label: 'WARRANTY STANDARD', value: 'Competition & Heritage Spec Stamped' },
    ],
    platforms: ['Track Builds', 'Air-Cooled Classics', 'Overland 4x4', 'Kit & Prototype'],
  },
];

const SEC: SectionData[] = [
  {
    n: 'Diagnostic Intake',
    img: 's1-start',
    len: '240 Points',
    grad: '100% Scan',
    spd: 'Live CAN-Bus',
    note: 'Full OEM computer diagnostics, ECU interrogation, and oscilloscope waveform analysis before a wrench touches the vehicle.'
  },
  {
    n: 'Powertrain Overhaul',
    img: 's2-zange',
    len: '310 Components',
    grad: '0.001 mm Tol.',
    spd: 'AWD Dyno',
    note: 'Internal engine machining, valvetrain blueprinting, forced induction rebuilds, and transmission repair for cars, trucks, and motorcycles.'
  },
  {
    n: 'Chassis & Suspension',
    img: 's3-wasserloch',
    len: '180 Points',
    grad: '4.2g Tested',
    spd: 'Laser Align',
    note: 'Multi-axis dynamic suspension calibration, subframe squaring, performance bushing pressing, and active electronic damper tuning.'
  },
  {
    n: 'Electrical & Hybrid EV',
    img: 's4-traverse',
    len: '620 Circuits',
    grad: '800V Rated',
    spd: 'Class 4 Cert.',
    note: 'Certified high-voltage hybrid & EV battery conditioning, inverter servicing, CAN-bus troubleshooting, and factory wire harness repair.'
  },
  {
    n: 'Braking & Hydraulics',
    img: 's5-kante',
    len: '290 Bar',
    grad: '610°F Boiling',
    spd: 'Dry Bleed',
    note: 'Carbon-ceramic and steel rotor resurfacing, ABS/ESC module programming, braided stainless line installation, and fluid pressure testing.'
  },
  {
    n: 'Road Test & Sign-Off',
    img: 's6-zielschuss',
    len: '410 Points',
    grad: '100% Verified',
    spd: 'Certified QC',
    note: 'Master technician dynamic road testing, computerized alignment verification, final torque audit, and stamped nationwide warranty sign-off.'
  },
];

const LENS = [240, 310, 180, 620, 290, 410];

interface PerformanceRailItem {
  id: string;
  title: string;
  metric: string;
  status: string;
  detail: string;
}

const PERFORMANCE_RAIL: PerformanceRailItem[] = [
  {
    id: '01',
    title: 'ENGINE RESPONSE',
    metric: '3.8 MS',
    status: 'OPTIMAL',
    detail: 'Direct throttle mapping via quad CAN-FD high-bandwidth transceivers.',
  },
  {
    id: '02',
    title: 'POWER DELIVERY',
    metric: '740 BHP',
    status: 'ACTIVE',
    detail: 'Linear boost spool profile tuned across variable-geometry twin turbines.',
  },
  {
    id: '03',
    title: 'THERMAL LOAD',
    metric: '88°C',
    status: 'NOMINAL',
    detail: 'Head-to-block coolant delta monitored across 12 discrete temperature nodes.',
  },
  {
    id: '04',
    title: 'BRAKING',
    metric: '1.38 G',
    status: 'CALIBRATED',
    detail: 'Dynamic deceleration telemetry and hydraulic bias balanced on load cell.',
  },
  {
    id: '05',
    title: 'ROAD TEST',
    metric: 'PASS 100%',
    status: 'VERIFIED',
    detail: 'Full-sweep road calibration verified with zero DTC flags recorded.',
  },
];

const renderStandardIcon = (id: string) => {
  switch (id) {
    case 'diagnose':
      return (
        <svg className="lanz-card__icon" viewBox="0 0 16 16" fill="none" stroke="#C7F500" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M1.5 8.5h2.5l2-4.5 3 8 2-5.5 1.5 2h2" />
        </svg>
      );
    case 'inspect':
      return (
        <svg className="lanz-card__icon" viewBox="0 0 16 16" fill="none" stroke="#C7F500" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="8" cy="8" r="5.5" />
          <path d="M8 1.5v2.5M8 12v2.5M1.5 8h2.5M12 8h2.5" />
        </svg>
      );
    case 'repair':
      return (
        <svg className="lanz-card__icon" viewBox="0 0 16 16" fill="none" stroke="#C7F500" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M10.2 2.8a3 3 0 0 0-3.6 3.6L2.8 10.2l3 3 3.8-3.8a3 3 0 0 0 3.6-3.6l-1.8 1.8-1.2-1.2 1.8-1.8z" />
        </svg>
      );
    case 'verify':
      return (
        <svg className="lanz-card__icon" viewBox="0 0 16 16" fill="none" stroke="#C7F500" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M8 2l4.8 1.8v4.2c0 3.2-2.1 5.4-4.8 6.5-2.7-1.1-4.8-3.3-4.8-6.5V3.8L8 2z" />
          <path d="M5.6 8l1.7 1.7 3.2-3.4" />
        </svg>
      );
    default:
      return null;
  }
};

const LANZ_STANDARD_STEPS: StandardStep[] = [
  {
    id: 'diagnose',
    stepNum: '01',
    title: 'DIAGNOSE',
    copy: 'Identify the actual problem.',
    detail: 'Direct factory scan protocols pinpoint ECU faults, CAN-FD bus dropouts, and live sensor anomalies.',
    tag: 'SYS-01 // DIAGNOSTIC LOGIC',
    subtag: 'ECU · 1,000HZ CAN-FD',
    anchor: {
      x: 37,
      y: 35,
      label: 'NODE 01',
      sub: 'ECU / SENSOR CLUSTER'
    },
    cardPos: { top: '8%', left: '3.5%' }
  },
  {
    id: 'inspect',
    stepNum: '02',
    title: 'INSPECT',
    copy: 'Verify the condition of the affected systems.',
    detail: 'High-definition borescope inspection, laser runout measurement, and brake friction analysis.',
    tag: 'SYS-02 // CHASSIS & BRAKE',
    subtag: 'OPTICAL · TOLERANCE ±0.01',
    anchor: {
      x: 27,
      y: 69,
      label: 'NODE 02',
      sub: 'RADIAL CALIPER & SUSPENSION'
    },
    cardPos: { bottom: '8%', left: '3.5%' }
  },
  {
    id: 'repair',
    stepNum: '03',
    title: 'REPAIR',
    copy: 'Carry out the work using the right equipment and parts.',
    detail: 'Certified torque angle tightening, clean dry-nitrogen pressure benches, and OEM-spec components.',
    tag: 'SYS-03 // POWERTRAIN BENCH',
    subtag: 'TORQUE · OEM SPEC BENCH',
    anchor: {
      x: 58,
      y: 54,
      label: 'NODE 03',
      sub: 'POWERTRAIN & INDUCTION'
    },
    cardPos: { top: '8%', right: '3.5%' }
  },
  {
    id: 'verify',
    stepNum: '04',
    title: 'VERIFY',
    copy: 'Test the vehicle before it leaves the workshop.',
    detail: 'AWD chassis dynamometer runout test, thermal sign-off audit, and logged road test validation.',
    tag: 'SYS-04 // DYNAMOMETER AUDIT',
    subtag: 'DYNO · AWD ROAD PASS',
    anchor: {
      x: 79,
      y: 65,
      label: 'NODE 04',
      sub: 'DRIVE HUB & SWINGARM'
    },
    cardPos: { bottom: '8%', right: '3.5%' }
  }
];

const pad = (n: number) => String(n).padStart(2, '0');

interface GlobalTechnician {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  aseCerts: number;
  experienceYears: number;
  specialty: string;
  firstPassRate: string;
  bay: string;
  shift: string;
  certBadge: string;
  keyCerts: string[];
  lifetimeCalibrations: string;
  activeStatus: string;
  coord: string;
}

const GLOBAL_TECHNICIANS: GlobalTechnician[] = [
  {
    id: 'tech-01',
    name: 'Marco Ritzel',
    country: 'United States',
    countryCode: 'USA',
    aseCerts: 7,
    experienceYears: 21,
    specialty: 'EV Master',
    firstPassRate: '99.4%',
    bay: 'BAY 01 · HV PROPULSION',
    shift: 'SHIFT ONE · LEAD',
    certBadge: 'LEVEL 5 OEM MASTER',
    keyCerts: ['Porsche E-Performance L4', 'Tesla / Rivian 800V Architecture', 'Bosch EV Master'],
    lifetimeCalibrations: '4,920+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '40.71° N, 74.00° W'
  },
  {
    id: 'tech-02',
    name: 'Tobias Ehrenberger',
    country: 'United States',
    countryCode: 'USA',
    aseCerts: 7,
    experienceYears: 21,
    specialty: 'EV Master',
    firstPassRate: '99.4%',
    bay: 'BAY 02 · BATTERY CELL LAB',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 5 OEM MASTER',
    keyCerts: ['BMW i-Division Master', 'Lucid Air Inverter Tier 3', 'SAE J1772 / CCS Standard'],
    lifetimeCalibrations: '4,810+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '34.05° N, 118.24° W'
  },
  {
    id: 'tech-03',
    name: 'Luca Ferrero',
    country: 'Italy',
    countryCode: 'ITA',
    aseCerts: 6,
    experienceYears: 18,
    specialty: 'Hybrid Systems',
    firstPassRate: '98.7%',
    bay: 'BAY 05 · HYBRID PROPULSION',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 SUPERCAR TECH',
    keyCerts: ['Ferrari Hy-Kers Certified', 'McLaren Hybrid Specialist', 'Marelli CAN-FD Logic'],
    lifetimeCalibrations: '3,740+ VEHICLES',
    activeStatus: 'CALIBRATING',
    coord: '44.53° N, 10.86° E'
  },
  {
    id: 'tech-04',
    name: 'Aksel Fjeld',
    country: 'Norway',
    countryCode: 'NOR',
    aseCerts: 5,
    experienceYears: 15,
    specialty: 'Diesel Systems',
    firstPassRate: '97.9%',
    bay: 'BAY 22 · FLEET & DIESEL',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 COMMERCIAL',
    keyCerts: ['Volvo Heavy Commercial Tier 4', 'Scania Common-Rail High Bar', 'Bosch CDI Injection'],
    lifetimeCalibrations: '3,290+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '59.91° N, 10.75° E'
  },
  {
    id: 'tech-05',
    name: 'Jean-Baptiste Roux',
    country: 'France',
    countryCode: 'FRA',
    aseCerts: 6,
    experienceYears: 17,
    specialty: 'Powertrain',
    firstPassRate: '98.2%',
    bay: 'BAY 07 · BLUEPRINT LAB',
    shift: 'SHIFT ONE · LEAD',
    certBadge: 'LEVEL 5 BLUEPRINT TECH',
    keyCerts: ['Alpine / Renault Sport Spec', 'Cosworth V6/V8 Internal Tolerances', 'Getrag Dual-Clutch'],
    lifetimeCalibrations: '3,890+ VEHICLES',
    activeStatus: 'DIAGNOSTIC LEAD',
    coord: '48.85° N, 2.35° E'
  },
  {
    id: 'tech-06',
    name: 'Dominik Haas',
    country: 'Austria',
    countryCode: 'AUT',
    aseCerts: 5,
    experienceYears: 14,
    specialty: 'Diagnostics',
    firstPassRate: '96.8%',
    bay: 'BAY 09 · OPTICAL & CAN',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 OSCILLOSCOPE',
    keyCerts: ['PicoScope 8-Ch Master', 'KTM X-Bow Lead Tech', 'CAN-FD Waveform Analyzer'],
    lifetimeCalibrations: '2,980+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '48.20° N, 16.37° E'
  },
  {
    id: 'tech-07',
    name: 'Bryce Halloran',
    country: 'United States',
    countryCode: 'USA',
    aseCerts: 7,
    experienceYears: 20,
    specialty: 'Electrical',
    firstPassRate: '98.9%',
    bay: 'BAY 03 · WIRE & ECU LAB',
    shift: 'SHIFT ONE · SUPERVISOR',
    certBadge: 'LEVEL 5 HARNESS MASTER',
    keyCerts: ['MoTeC M1 Certified Tuner', 'Mil-Spec Wire Harness IPC-620', 'FlexRay / Ethernet CAN'],
    lifetimeCalibrations: '4,450+ VEHICLES',
    activeStatus: 'SHIFT LEAD',
    coord: '41.87° N, 87.62° W'
  },
  {
    id: 'tech-08',
    name: 'Matthias Brunner',
    country: 'Switzerland',
    countryCode: 'SUI',
    aseCerts: 6,
    experienceYears: 16,
    specialty: 'Brake Systems',
    firstPassRate: '97.6%',
    bay: 'BAY 14 · HYDRAULIC BENCH',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 FRICTION TECH',
    keyCerts: ['Brembo Carbon-Ceramic L4', 'Bosch iBooster ESC Module', 'AP Racing Motorsport'],
    lifetimeCalibrations: '3,610+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '47.37° N, 8.54° E'
  },
  {
    id: 'tech-09',
    name: 'Erik Sandvik',
    country: 'Norway',
    countryCode: 'NOR',
    aseCerts: 5,
    experienceYears: 13,
    specialty: 'Suspension',
    firstPassRate: '96.4%',
    bay: 'BAY 16 · DYNAMICS & ALIGN',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 DAMPING TECH',
    keyCerts: ['Öhlins TTX Certified Specialist', 'Hunter HawkEye 3D Laser', 'KW DDC Damper Tuning'],
    lifetimeCalibrations: '2,750+ VEHICLES',
    activeStatus: 'CALIBRATING',
    coord: '60.39° N, 5.32° E'
  },
  {
    id: 'tech-10',
    name: 'Andrea Comelli',
    country: 'Italy',
    countryCode: 'ITA',
    aseCerts: 7,
    experienceYears: 19,
    specialty: 'Engine Performance',
    firstPassRate: '98.5%',
    bay: 'BAY 06 · DYNO CELL NORTH',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 5 DYNO MASTER',
    keyCerts: ['Lamborghini V10/V12 Master', 'Ducati Desmodromic Lead', 'Superflow AWD Dyno Cert'],
    lifetimeCalibrations: '4,120+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '44.49° N, 11.34° E'
  },
  {
    id: 'tech-11',
    name: 'Rok Petric',
    country: 'United States',
    countryCode: 'USA',
    aseCerts: 6,
    experienceYears: 17,
    specialty: 'Transmission',
    firstPassRate: '97.8%',
    bay: 'BAY 11 · GEARBOX & AWD',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 DRIVETRAIN',
    keyCerts: ['ZF 8HP / 9HP Certified Rebuild', 'Tremec DCT Specialist', 'BorgWarner AWD Transfer'],
    lifetimeCalibrations: '3,560+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '32.77° N, 96.79° W'
  },
  {
    id: 'tech-12',
    name: 'Felix Wagner',
    country: 'Germany',
    countryCode: 'GER',
    aseCerts: 5,
    experienceYears: 14,
    specialty: 'Cooling Systems',
    firstPassRate: '96.9%',
    bay: 'BAY 15 · THERMAL LAB',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 THERMAL TECH',
    keyCerts: ['AMG Twin-Turbo Coolant Loop', 'Mahle Thermal Systems L3', 'Dynamic Pressure Vacuum Tech'],
    lifetimeCalibrations: '2,890+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '48.77° N, 9.18° E'
  },
  {
    id: 'tech-13',
    name: 'Daniel Clarke',
    country: 'United Kingdom',
    countryCode: 'GBR',
    aseCerts: 6,
    experienceYears: 18,
    specialty: 'Chassis',
    firstPassRate: '98.1%',
    bay: 'BAY 18 · STRUCTURAL JIG',
    shift: 'SHIFT ONE · LEAD',
    certBadge: 'LEVEL 5 CHASSIS MASTER',
    keyCerts: ['Aston Martin Bonded Aluminum', 'Lotus Monocoque Tub Cert', 'Laser Subframe Squaring'],
    lifetimeCalibrations: '3,920+ VEHICLES',
    activeStatus: 'DIAGNOSTIC LEAD',
    coord: '52.48° N, 1.89° W'
  },
  {
    id: 'tech-14',
    name: 'Sergio Molina',
    country: 'Spain',
    countryCode: 'ESP',
    aseCerts: 5,
    experienceYears: 15,
    specialty: 'Fuel Systems',
    firstPassRate: '96.7%',
    bay: 'BAY 20 · INJECTION LAB',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 PRESSURE TECH',
    keyCerts: ['Direct Injection 350-Bar Test', 'Bosch Piezo Flow Matching', 'E85 Flex-Fuel Calibration'],
    lifetimeCalibrations: '3,140+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '40.41° N, 3.70° W'
  },
  {
    id: 'tech-15',
    name: 'Ryan Mitchell',
    country: 'Canada',
    countryCode: 'CAN',
    aseCerts: 6,
    experienceYears: 17,
    specialty: 'Emissions',
    firstPassRate: '97.3%',
    bay: 'BAY 24 · EMISSIONS & EVAP',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 EMISSIONS MASTER',
    keyCerts: ['EPA / CARB Tier 3 Specialist', 'Catalyst Efficiency Analyzer', 'DEF / SCR Dosing Certified'],
    lifetimeCalibrations: '3,480+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '43.65° N, 79.38° W'
  },
  {
    id: 'tech-16',
    name: 'Oskar Lindgren',
    country: 'Sweden',
    countryCode: 'SWE',
    aseCerts: 5,
    experienceYears: 14,
    specialty: 'HVAC Systems',
    firstPassRate: '96.6%',
    bay: 'BAY 26 · CLIMATE & ADAS',
    shift: 'SHIFT ONE',
    certBadge: 'LEVEL 4 CLIMATE TECH',
    keyCerts: ['R1234yf Heat Pump Certified', 'Volvo Twin-Engine Climate Loop', 'Acoustic Leak Detection'],
    lifetimeCalibrations: '2,930+ VEHICLES',
    activeStatus: 'BENCH ACTIVE',
    coord: '59.32° N, 18.06° E'
  }
];

const FLAG_PATHS: Record<string, React.ReactNode> = {
  SUI: (
    <>
      <rect width="3" height="2" fill="#D52B1E" />
      <rect x="1.25" y="0.4" width="0.5" height="1.2" fill="#fff" />
      <rect x="0.7" y="0.95" width="1.6" height="0.5" fill="#fff" />
    </>
  ),
  AUT: (
    <>
      <rect width="3" height="2" fill="#ED2939" />
      <rect y="0.667" width="3" height="0.667" fill="#fff" />
    </>
  ),
  ITA: (
    <>
      <rect width="3" height="2" fill="#009246" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#CE2B37" />
    </>
  ),
  NOR: (
    <>
      <rect width="3" height="2" fill="#BA0C2F" />
      <rect x="0.75" width="0.5" height="2" fill="#fff" />
      <rect y="0.75" width="3" height="0.5" fill="#fff" />
      <rect x="0.875" width="0.25" height="2" fill="#00205B" />
      <rect y="0.875" width="3" height="0.25" fill="#00205B" />
    </>
  ),
  FRA: (
    <>
      <rect width="3" height="2" fill="#002395" />
      <rect x="1" width="1" height="2" fill="#fff" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </>
  ),
  USA: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <g fill="#B22234">
        <rect width="3" height="0.154" />
        <rect y="0.308" width="3" height="0.154" />
        <rect y="0.615" width="3" height="0.154" />
        <rect y="0.923" width="3" height="0.154" />
        <rect y="1.231" width="3" height="0.154" />
        <rect y="1.538" width="3" height="0.154" />
        <rect y="1.846" width="3" height="0.154" />
      </g>
      <rect width="1.2" height="1.077" fill="#3C3B6E" />
    </>
  ),
  CAN: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect width="0.75" height="2" fill="#D80621" />
      <rect x="2.25" width="0.75" height="2" fill="#D80621" />
      <path d="M1.5 .45 l.13 .34 .3-.13-.14 .35 .33.05-.28 .2 .12 .18-.34-.05.02 .45h-.24l.02-.45-.34 .05 .12-.18-.28-.2 .33-.05-.14-.35 .3 .13z" fill="#D80621" />
    </>
  ),
  SLO: (
    <>
      <rect width="3" height="2" fill="#fff" />
      <rect y="0.667" width="3" height="0.667" fill="#0B4EA2" />
      <rect y="1.333" width="3" height="0.667" fill="#D50000" />
    </>
  ),
  GER: (
    <>
      <rect width="3" height="2" fill="#000" />
      <rect y="0.667" width="3" height="0.667" fill="#DD0000" />
      <rect y="1.333" width="3" height="0.667" fill="#FFCE00" />
    </>
  ),
  GBR: (
    <>
      <rect width="3" height="2" fill="#012169" />
      <path d="M0 0 L3 2 M3 0 L0 2" stroke="#fff" strokeWidth="0.4" />
      <path d="M0 0 L3 2 M3 0 L0 2" stroke="#C8102E" strokeWidth="0.2" />
      <path d="M1.5 0 V2 M0 1 H3" stroke="#fff" strokeWidth="0.6" />
      <path d="M1.5 0 V2 M0 1 H3" stroke="#C8102E" strokeWidth="0.36" />
    </>
  ),
  ESP: (
    <>
      <rect width="3" height="0.5" fill="#AA151B" />
      <rect y="0.5" width="3" height="1" fill="#F1BF00" />
      <rect y="1.5" width="3" height="0.5" fill="#AA151B" />
    </>
  ),
  SWE: (
    <>
      <rect width="3" height="2" fill="#005293" />
      <rect x="0.9" width="0.4" height="2" fill="#FECB00" />
      <rect y="0.8" width="3" height="0.4" fill="#FECB00" />
    </>
  ),
  CZE: (
    <>
      <rect width="3" height="1" fill="#fff" />
      <rect y="1" width="3" height="1" fill="#D7141A" />
      <path d="M0 0 L1.5 1 L0 2Z" fill="#11457E" />
    </>
  ),
};

const ESTIMATOR_SERVICES: EstimatorService[] = [
  {
    id: 'oil',
    name: 'OIL SERVICE',
    code: 'SRV-01',
    category: 'ROUTINE',
    price: 145,
    laborTime: '1.0 hr',
    parts: 'OEM Full Synthetic + Filter',
    desc: 'Factory-spec fluid exchange & digital seal inspection',
  },
  {
    id: 'brakes',
    name: 'BRAKE SERVICE',
    code: 'BRK-04',
    category: 'SAFETY',
    price: 340,
    laborTime: '2.0 hrs',
    parts: 'Ceramic Pads & Sensor Wire',
    desc: 'Hydraulic caliper torque, rotor micrometer test & pad renewal',
  },
  {
    id: 'battery',
    name: 'BATTERY & CHARGING',
    code: 'PWR-02',
    category: 'ELECTRICAL',
    price: 195,
    laborTime: '1.0 hr',
    parts: 'AGM / High-Rate Battery',
    desc: 'CCA impedance load test, terminal cleansing & ECM registration',
  },
  {
    id: 'diag',
    name: 'DIAGNOSTICS & TELEMETRY',
    code: 'DIG-09',
    category: 'DIAGNOSTIC',
    price: 165,
    laborTime: '1.5 hrs',
    parts: 'DoIP & CAN-FD Bus Scan',
    desc: 'Full optical network audit, DTC isolation & sensor sweep',
  },
  {
    id: 'ac',
    name: 'AC & CLIMATE',
    code: 'CLM-03',
    category: 'CLIMATE',
    price: 230,
    laborTime: '1.8 hrs',
    parts: 'R1234yf Refrigerant + Dye',
    desc: 'Refrigerant recovery, vacuum decay test & compressor audit',
  },
  {
    id: 'engine',
    name: 'ENGINE REPAIR',
    code: 'ENG-07',
    category: 'POWERTRAIN',
    price: 780,
    laborTime: '4.5 hrs',
    parts: 'Timing/Valvetrain Gaskets',
    desc: 'Cylinder compression testing, cam timing & leakdown isolation',
  },
  {
    id: 'suspension',
    name: 'SUSPENSION & CHASSIS',
    code: 'SUS-05',
    category: 'CHASSIS',
    price: 420,
    laborTime: '2.5 hrs',
    parts: 'Bushings & Tie-Rod Hardware',
    desc: '3D laser alignment, damper dyno test & geometry calibration',
  },
  {
    id: 'transmission',
    name: 'TRANSMISSION & DRIVETRAIN',
    code: 'TRN-08',
    category: 'DRIVETRAIN',
    price: 590,
    laborTime: '3.2 hrs',
    parts: 'DCT / ATF Synthetic + Filter',
    desc: 'Valve body solenoid adaptation, fluid drain & pressure calibration',
  },
];

const PLATFORM_MULTIPLIERS = {
  coupe: { name: 'GT / COUPE', mult: 1.0, sub: 'Performance Sports Architecture' },
  sedan: { name: 'SPORT SEDAN', mult: 1.05, sub: 'Luxury & Daily Sedan Platform' },
  suv: { name: 'SUV / EXOTIC', mult: 1.15, sub: 'All-Wheel-Drive & Hybrid Chassis' },
  truck: { name: 'HEAVY TRUCK', mult: 1.30, sub: 'Commercial Fleet & Severe-Duty' },
};

const TESTIMONIALS: TestimonialItem[] = [
  {
    id: 't1',
    quote: 'Found an intermittent optical CAN-FD bus drop that two other premier dealerships failed to diagnose over six months. Diagnosed and resolved within 48 hours.',
    author: 'Marcus Vance',
    role: 'Chief Fleet Director',
    vehicle: '2023 Porsche 911 GT3 RS (992)',
    service: 'Optical CAN-FD Fault Isolation & ECU Gateway Re-flash',
    bay: 'BAY 04 · NORTH WING',
    archiveCode: 'VERIFIED ARCHIVE #VR-9821',
    metric: '48 hr turnaround · Zero fault recurrence',
    rating: '5.0 ★ EXCELLENCE',
  },
  {
    id: 't2',
    quote: 'Their 3D laser alignment and hydraulic brake overhaul transformed the track response of my RS6. The itemized telemetry report was cleaner than factory documentation.',
    author: 'Elena Rostova',
    role: 'Track Day Competitor',
    vehicle: '2022 Audi RS6 Avant Dynamic Plus',
    service: 'Master Carbon-Ceramic Brake Overhaul & 3D Alignment',
    bay: 'BAY 08 · CHASSIS & DYNAMICS',
    archiveCode: 'VERIFIED ARCHIVE #VR-8419',
    metric: '±0.01° camber tolerance verified',
    rating: '5.0 ★ EXCELLENCE',
  },
  {
    id: 't3',
    quote: 'Commercial fleet maintenance with zero guesswork. Every truck is scanned, torqued to OEM spec, and returned on exact schedule with digital inspection logs.',
    author: 'Devon Chen',
    role: 'Logistics Operations Lead',
    vehicle: 'Fleet Series · Ford Super Duty F-450 PowerStroke',
    service: 'High-Pressure Common Rail & Turbo System Overhaul',
    bay: 'BAY 16 · COMMERCIAL TRUCK WING',
    archiveCode: 'VERIFIED ARCHIVE #VR-7740',
    metric: '12 vehicles serviced · 100% on-time release',
    rating: '5.0 ★ EXCELLENCE',
  },
  {
    id: 't4',
    quote: 'High-voltage battery insulation fault resolved with surgical precision. True master technicians who understand modern EV architecture down to cell-level balancing.',
    author: 'Henrik Lindqvist',
    role: 'Automotive Systems Engineer',
    vehicle: '2024 BMW i4 M50 Dual-Motor EV',
    service: 'High-Voltage Pyrotechnic Switch & Inverter Calibration',
    bay: 'BAY 02 · HIGH-VOLTAGE PROPULSION',
    archiveCode: 'VERIFIED ARCHIVE #VR-9104',
    metric: 'Factory insulation resistance restored',
    rating: '5.0 ★ EXCELLENCE',
  },
];

const FAQS: FaqItem[] = [
  {
    num: '01',
    category: 'DIAGNOSTICS',
    question: 'How much does a vehicle diagnostic cost?',
    answer: 'Comprehensive factory-level OBD-II, CAN-FD, and DoIP optical bus diagnostics start at $165. If you approve the recommended repairs with LANZ, 100% of your diagnostic fee is directly credited toward the final work order.',
  },
  {
    num: '02',
    category: 'FLEET & MOTO',
    question: 'Do you service motorcycles and trucks?',
    answer: 'Yes. Our facility features dedicated calibration bays equipped with chassis dynamometers for performance sport motorcycles, alongside heavy-duty hydraulic 4-post lifts engineered for commercial trucks and fleet vehicles.',
  },
  {
    num: '03',
    category: 'TURNAROUND',
    question: 'How long does a typical repair take?',
    answer: 'Routine maintenance, fluid exchanges, and digital safety inspections are completed same-day within 2 to 4 hours. Major mechanical overhauls, engine timing calibrations, and complex electrical diagnostics generally take 24 to 72 hours.',
  },
  {
    num: '04',
    category: 'BOOKINGS',
    question: 'Do I need an appointment?',
    answer: 'Scheduled appointments are strongly recommended to guarantee dedicated technician assignment and bay allocation. However, we accept priority drive-in intake for urgent safety faults, check engine warnings, and sudden mechanical failures.',
  },
  {
    num: '05',
    category: 'TRANSPARENCY',
    question: 'Do you provide estimates before repairs begin?',
    answer: 'Always. Under the LANZ Protocol, no teardown, parts replacement, or billable labor commences without a digital, itemized estimate detailing OEM parts numbers and labor times approved by you in advance.',
  },
  {
    num: '06',
    category: 'COVERAGE',
    question: 'What vehicles do you service?',
    answer: 'We specialize in European (Porsche, BMW, Mercedes-Benz, Audi, Ferrari, McLaren), domestic performance, Japanese engineering, high-voltage battery EVs (Tesla, Lucid, Taycan), and performance motorcycles.',
  },
  {
    num: '07',
    category: 'POWERTRAIN',
    question: 'Do you handle major engine and transmission repairs?',
    answer: 'Yes. Our certified Master Powertrain technicians handle complete mechanical teardowns, dual-clutch (PDK, DSG) rebuilds, cylinder head resurfacing, valvetrain blueprinting, and transfer case restorations.',
  },
  {
    num: '08',
    category: 'ESTIMATES',
    question: 'Is the online repair estimate final?',
    answer: 'The online repair estimator calculates an accurate cost bracket based on manufacturer book labor times and OEM components. Final guaranteed pricing is confirmed after our master technician completes the physical multi-point intake scan.',
  },
];

export default function App() {
  // 01: Cover numbers counting state
  const [startersCount, setStartersCount] = useState<string>('0');
  const [verticalCount, setVerticalCount] = useState<string>('0 pt');
  const [courseCount, setCourseCount] = useState<string>('0+');
  const [steepestCount, setSteepestCount] = useState<string>('0 %');

  // 02: Vehicles We Service sticky-scroll
  const [activeVehIndex, setActiveVehIndex] = useState<number>(0);
  const [vehProgress, setVehProgress] = useState<number>(0.25);
  const vehSectionRef = useRef<HTMLElement>(null);
  const vehCardStepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 03: LANZ Performance System
  const perfVideoRef = useRef<HTMLVideoElement>(null);
  const perfSectionRef = useRef<HTMLElement>(null);
  const [activeRailIndex, setActiveRailIndex] = useState<number>(0);
  const [liveRpm, setLiveRpm] = useState<number>(6840);
  const [liveSpeed, setLiveSpeed] = useState<number>(188);

  // Performance Section Video & Viewport Revisit Auto-Replay
  useEffect(() => {
    const video = perfVideoRef.current;
    const section = perfSectionRef.current;
    if (!video) return;

    // Ensure DOM properties are explicitly set for autoplay compliance
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const playVideo = () => {
      video.muted = true;
      const promise = video.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Handled silently for browser restrictions
        });
      }
    };

    // Synchronize live telemetry metrics with video playback phases
    const handleTimeUpdate = () => {
      const t = video.currentTime;
      if (t < 2.8) {
        // Idle phase (0 MPH)
        setLiveSpeed(0);
        setLiveRpm(850 + Math.floor(Math.sin(Date.now() / 300) * 15));
      } else if (t >= 2.8 && t < 6.2) {
        // Warp acceleration blast (188 MPH)
        setLiveSpeed(188);
        setLiveRpm(6880 + Math.floor(Math.sin(Date.now() / 200) * 35));
      } else {
        // High-speed cruise phase (158 MPH)
        setLiveSpeed(158);
        setLiveRpm(6420 + Math.floor(Math.sin(Date.now() / 250) * 20));
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);

    // Observer to autoplay once the section is in view
    const observerTarget = section || video;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.currentTime = 0;
            playVideo();
          } else {
            video.pause();
          }
        });
      },
      { threshold: [0.1, 0.25, 0.5] }
    );

    observer.observe(observerTarget);

    // Also trigger attempt on initial mount and first user interaction
    playVideo();
    const handleFirstInteraction = () => {
      playVideo();
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });

    return () => {
      observer.disconnect();
      video.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('scroll', handleFirstInteraction);
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Subtle auto-advance for the technical data rail
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveRailIndex((prev) => (prev + 1) % 5);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // 04: The Lanz Standard Diagnostic Section
  const standardSectionRef = useRef<HTMLElement>(null);
  const [isStandardEntered, setIsStandardEntered] = useState<boolean>(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [standardParallax, setStandardParallax] = useState<number>(0);

  // 05: Master Technicians 3D Flip State
  const [activeFlippedTechId, setActiveFlippedTechId] = useState<string | null>(null);
  const [hoveredRow, setHoveredRow] = useState<AthleteRow | null>(null);
  const [cardPos, setCardPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // 06: Car Fix Cost Estimator State
  const [estimatorPlatform, setEstimatorPlatform] = useState<'coupe' | 'sedan' | 'suv' | 'truck'>('coupe');
  const [selectedEstimatorServices, setSelectedEstimatorServices] = useState<string[]>(['diag', 'oil']);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingContact, setBookingContact] = useState<string>('');
  const [bookingVehicleDetails, setBookingVehicleDetails] = useState<string>('');

  // 07: Customer Testimonials State
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState<number>(0);

  // 08: FAQ State
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);

  // 09: Redesigned Footer Dispatch Subscription State
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSuccess, setNewsletterSuccess] = useState<boolean>(false);

  // 10: Fixed Navigation & Mobile Burger Menu State
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // 11: Scroll-Controlled Hero Video & Text Fade State
  const heroTrackRef = useRef<HTMLDivElement | null>(null);
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [heroTextOpacity, setHeroTextOpacity] = useState<number>(1);

  // Scroll-controlled video scrub & progressive text fade with in-memory preloading
  useEffect(() => {
    const video = heroVideoRef.current;
    const track = heroTrackRef.current;
    if (!video || !track) return;

    const VIDEO_URL =
      'https://res.cloudinary.com/b2s3bcgi/video/upload/q_auto,f_auto/v1790175588/Cinematic_Transformation_Video-ezremove.mp4';

    // 1. Preload & buffer full 10-second video into memory blob to eliminate seek lag & range requests
    let blobUrl: string | null = null;
    let isCancelled = false;

    fetch(VIDEO_URL)
      .then((res) => res.blob())
      .then((blob) => {
        if (isCancelled || !video) return;
        blobUrl = URL.createObjectURL(blob);
        const prevTime = video.currentTime;
        video.src = blobUrl;
        video.currentTime = prevTime;
        video.pause();
      })
      .catch(() => {
        // Direct stream fallback
      });

    video.pause();
    video.currentTime = 0;

    let targetTime = 0;
    let isSeeking = false;
    let rafId: number;

    const performSeek = () => {
      if (!video) return;
      if (isSeeking) return;

      const diff = Math.abs(video.currentTime - targetTime);
      if (diff > 0.012) {
        isSeeking = true;
        try {
          if ('fastSeek' in video && typeof (video as any).fastSeek === 'function') {
            (video as any).fastSeek(targetTime);
          } else {
            video.currentTime = targetTime;
          }
        } catch (_) {
          isSeeking = false;
        }
      }
    };

    const handleSeeked = () => {
      isSeeking = false;
      const diff = Math.abs((video?.currentTime || 0) - targetTime);
      if (diff > 0.012) {
        performSeek();
      }
    };

    video.addEventListener('seeked', handleSeeked);

    const updateHeroScroll = () => {
      if (!track || !video) return;
      const rect = track.getBoundingClientRect();
      const scrollableDist = rect.height - window.innerHeight;

      if (scrollableDist <= 0) return;

      // Calculate exact scroll progress: 0 to 1
      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDist));

      // Video timeline scrub 0% -> 100%
      const duration =
        video.duration && !isNaN(video.duration) && video.duration > 0
          ? video.duration
          : 10;
      
      // Ensure exact final frame is reached at progress = 1
      targetTime = progress >= 1 ? Math.max(0, duration - 0.001) : progress * duration;

      performSeek();

      // Scroll-based progressive text fade:
      // 0% -> 15%: Full 100% visibility (user has started scrolling)
      // 15% -> 60%: Smooth cinematic gradual fade down to 0
      // 60% -> 100%: 0% opacity (vehicle transformation is full visual focus)
      let opacity = 1;
      if (progress <= 0.15) {
        opacity = 1;
      } else if (progress >= 0.6) {
        opacity = 0;
      } else {
        const pNorm = (progress - 0.15) / (0.6 - 0.15);
        opacity = 0.5 * (1 + Math.cos(Math.PI * pNorm));
      }

      setHeroTextOpacity(Number(opacity.toFixed(3)));
    };

    const handleScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateHeroScroll);
    };

    const handleLoadedMetadata = () => {
      video.pause();
      updateHeroScroll();
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial update
    updateHeroScroll();

    return () => {
      isCancelled = true;
      cancelAnimationFrame(rafId);
      video.removeEventListener('seeked', handleSeeked);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, []);

  // Scroll listener for fixed navigation bar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open, handle ESC and resize
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMobileMenuOpen]);

  // Initialize Lenis and Intersection Observer
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Numbers animation in hero
    const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2009');
    if (isReduced) {
      setStartersCount('68');
      setVerticalCount('860 pt');
      setCourseCount(group(2050) + '+');
      setSteepestCount('85 %');
    } else {
      const animateNum = (
        target: number,
        suffix: string,
        delay: number,
        setter: (v: string) => void,
        useGroup = false
      ) => {
        setTimeout(() => {
          const t0 = performance.now();
          const dur = 900;
          const frame = (now: number) => {
            const t = Math.min(1, (now - t0) / dur);
            const e = 1 - Math.pow(1 - t, 3);
            const v = Math.round(target * e);
            setter((useGroup ? group(v) : v) + suffix);
            if (t < 1) requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }, delay);
      };

      animateNum(68, '', 1500 + 3 * 90, setStartersCount);
      animateNum(860, ' pt', 1500 + 4 * 90, setVerticalCount);
      animateNum(2050, '+', 1500 + 5 * 90, setCourseCount, true);
      animateNum(85, ' %', 1500 + 6 * 90, setSteepestCount);
    }

    // Lenis smooth scroll
    let lenisInstance: Lenis | null = null;
    if (!isReduced) {
      lenisInstance = new Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        syncTouch: false,
      });

      const raf = (time: number) => {
        lenisInstance?.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }

    // IntersectionObserver for .io classes
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    document.querySelectorAll('.io').forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      lenisInstance?.destroy();
    };
  }, []);

  // Section 02 Vehicles We Service scroll listener
  useEffect(() => {
    const onScroll = () => {
      if (!vehSectionRef.current) return;
      const secRect = vehSectionRef.current.getBoundingClientRect();
      const total = secRect.height - window.innerHeight;
      if (total <= 0) {
        setActiveVehIndex(0);
        return;
      }

      // Continuous progress line fill
      const rawT = -secRect.top / total;
      const t = Math.min(1, Math.max(0, rawT));
      setVehProgress(t);

      // Active index based on card positions
      let currentActive = 0;
      vehCardStepRefs.current.forEach((el, idx) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.44) {
          currentActive = idx;
        }
      });
      setActiveVehIndex(currentActive);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const scrollToVehCard = (index: number) => {
    const stepEl = vehCardStepRefs.current[index];
    if (stepEl) {
      stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // The Lanz Standard Observer & Scroll Parallax
  useEffect(() => {
    const section = standardSectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsStandardEntered(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(section);

    const onScroll = () => {
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2;
      const offset = Math.max(-14, Math.min(14, -mid * 0.035));
      setStandardParallax(offset);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Estimator helpers
  const toggleEstimatorService = (id: string) => {
    setSelectedEstimatorServices((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const currentPlatform = PLATFORM_MULTIPLIERS[estimatorPlatform];
  const selectedServicesList = ESTIMATOR_SERVICES.filter((s) =>
    selectedEstimatorServices.includes(s.id)
  );

  const estimatedTotalCost = selectedServicesList.reduce((acc, s) => {
    return acc + Math.round(s.price * currentPlatform.mult);
  }, 0);

  const estimatedLaborTime = selectedServicesList
    .reduce((acc, s) => acc + parseFloat(s.laborTime), 0)
    .toFixed(1);

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingModalOpen(false);
    }, 2400);
  };

  return (
    <>
      {/* ==================================================== FIXED TOP NAVIGATION BAR */}
      <header
        className={`lanz-fixed-nav ${isScrolled ? 'lanz-fixed-nav--scrolled' : ''} ${isMobileMenuOpen ? 'lanz-fixed-nav--menu-open' : ''}`}
        aria-label="Main Navigation"
      >
        <div className="lanz-fixed-nav__inner">
          <div className="lanz-fixed-nav__brand">
            <a
              href="#"
              className="lanz-fixed-nav__brand-title"
              onClick={(e) => {
                e.preventDefault();
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              aria-label="LANZ AUTOMOBILES - Return to top"
            >
              <span className="lanz-fixed-nav__brand-dot" aria-hidden="true" />
              LANZ AUTOMOBILES
            </a>
          </div>

          <nav className="lanz-fixed-nav__desktop-links" aria-label="Desktop Navigation Links">
            <a
              href="#face"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('face');
              }}
            >
              SERVICES
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#trace"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('trace');
              }}
            >
              PERFORMANCE
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#spec"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('spec');
              }}
            >
              STANDARD
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#technicians"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('technicians');
              }}
            >
              TECHNICIANS
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#estimator"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('estimator');
              }}
            >
              ESTIMATOR
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#testimonials"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('testimonials');
              }}
            >
              TESTIMONIALS
            </a>
            <span className="lanz-fixed-nav__sep" aria-hidden="true">/</span>
            <a
              href="#faq"
              className="lanz-fixed-nav__link"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('faq');
              }}
            >
              FAQ
            </a>
          </nav>

          <div className="lanz-fixed-nav__right">
            <div className="lanz-fixed-nav__desktop-actions">
              <button
                type="button"
                onClick={() => scrollToSection('estimator')}
                className="hero-btn hero-btn--secondary"
                aria-label="Calculate Vehicle Repair Cost Estimate"
              >
                CALCULATE ESTIMATE
              </button>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(true)}
                className="hero-btn hero-btn--primary"
                aria-label="Book service bay"
              >
                <span>BOOK SERVICE</span>
                <span className="hero-btn__arrow" aria-hidden="true">→</span>
              </button>
            </div>

            {/* Mobile Burger Toggle Button */}
            <button
              type="button"
              className={`lanz-burger-btn ${isMobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="lanzMobileMenu"
            >
              <span className="lanz-burger-btn__box" aria-hidden="true">
                <span className="lanz-burger-btn__line lanz-burger-btn__line--top" />
                <span className="lanz-burger-btn__line lanz-burger-btn__line--mid" />
                <span className="lanz-burger-btn__line lanz-burger-btn__line--bot" />
              </span>
              <span className="lanz-burger-btn__label mono">
                {isMobileMenuOpen ? 'CLOSE' : 'MENU'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Sheet (Rendered at top-level with high z-index) */}
      <div
        id="lanzMobileMenu"
        className={`lanz-mobile-drawer ${isMobileMenuOpen ? 'is-open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="lanz-mobile-drawer__backdrop" onClick={() => setIsMobileMenuOpen(false)} />
        <div className="lanz-mobile-drawer__content">
          <div className="lanz-mobile-drawer__telemetry mono">
            <div className="lanz-mobile-drawer__status">
              <span className="lanz-mobile-live-dot" /> ALL 32 BAYS OPERATIONAL
            </div>
            <div className="lanz-mobile-drawer__id">
              US-FAC-LA8401
            </div>
          </div>

          <nav className="lanz-mobile-drawer__links" aria-label="Mobile Navigation Menu">
            {[
              { href: '#face', id: 'face', num: '01', title: 'SERVICES & VEHICLES', desc: 'Powertrain, suspension, diagnostics' },
              { href: '#trace', id: 'trace', num: '02', title: 'PERFORMANCE DATA', desc: 'Chassis dyno & laser geometry' },
              { href: '#spec', id: 'spec', num: '03', title: 'ENGINEERING STANDARD', desc: 'ISO 9001 & OEM protocols' },
              { href: '#technicians', id: 'technicians', num: '04', title: 'MASTER TECHNICIANS', desc: 'ASE certified master specialists' },
              { href: '#estimator', id: 'estimator', num: '05', title: 'COST ESTIMATOR', desc: 'Interactive repair price calculator' },
              { href: '#testimonials', id: 'testimonials', num: '06', title: 'CLIENT TESTIMONIALS', desc: 'Verified customer reviews & telemetry' },
              { href: '#faq', id: 'faq', num: '07', title: 'TECHNICAL FAQ', desc: 'Warranties, turnarounds, towing' },
            ].map((item) => (
              <a
                key={item.id}
                href={item.href}
                className="lanz-mobile-link"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection(item.id);
                }}
              >
                <span className="lanz-mobile-link__num mono">{item.num}</span>
                <div className="lanz-mobile-link__info">
                  <span className="lanz-mobile-link__title">{item.title}</span>
                  <span className="lanz-mobile-link__desc mono">{item.desc}</span>
                </div>
                <span className="lanz-mobile-link__arrow" aria-hidden="true">→</span>
              </a>
            ))}
          </nav>

          <div className="lanz-mobile-drawer__cta">
            <button
              type="button"
              className="hero-btn hero-btn--secondary lanz-mobile-cta-btn"
              onClick={() => {
                scrollToSection('estimator');
              }}
            >
              CALCULATE ESTIMATE
            </button>
            <button
              type="button"
              className="hero-btn hero-btn--primary lanz-mobile-cta-btn"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsBookingModalOpen(true);
              }}
            >
              <span>BOOK SERVICE BAY</span>
              <span className="hero-btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>

          <div className="lanz-mobile-drawer__footer mono">
            <div className="lanz-mobile-footer-row">
              <span>DIRECT INTAKE:</span>
              <a href="tel:+18005555269" className="lanz-mobile-phone-link">+1 (800) 555-LANZ</a>
            </div>
            <div className="lanz-mobile-footer-row">
              <span>WORKSHOP:</span>
              <span>MON-FRI 06:30-19:30 EST</span>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================== 01 · COVER (SCROLL CONTROLLED) */}
      <div ref={heroTrackRef} className="cover-track">
        <header className="cover">
          <span className="beam" aria-hidden="true"></span>
          <div className="cover__plate">
            <video
              ref={heroVideoRef}
              className="cover__video"
              muted
              playsInline
              preload="auto"
              loop={false}
              controls={false}
              disablePictureInPicture
            >
              <source
                src="https://res.cloudinary.com/b2s3bcgi/video/upload/q_auto,f_auto/v1790175588/Cinematic_Transformation_Video-ezremove.mp4"
                type="video/mp4"
              />
              <source
                src="https://res.cloudinary.com/b2s3bcgi/video/upload/v1790175588/Cinematic_Transformation_Video-ezremove.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div
            className="cover__type"
            style={{
              opacity: heroTextOpacity,
              transition: 'opacity 0.15s ease-out',
              pointerEvents: heroTextOpacity < 0.1 ? 'none' : 'auto',
            }}
          >
            <h1 id="wordmark" aria-label="LANZ AUTOMOBILES">
              <span className="wordmark__word wordmark__word--main">
                {'LANZ'.split('').map((char, i) => (
                  <span key={`lanz-${i}`} style={{ '--i': i } as React.CSSProperties} aria-hidden="true">
                    {char}
                  </span>
                ))}
              </span>
              <span className="wordmark__space" aria-hidden="true">&nbsp;</span>
              <span className="wordmark__word wordmark__word--sub">
                {'AUTOMOBILES'.split('').map((char, i) => (
                  <span key={`auto-${i}`} style={{ '--i': i + 4 } as React.CSSProperties} aria-hidden="true">
                    {char}
                  </span>
                ))}
              </span>
            </h1>
          </div>
          <div className="cover__racer" style={{ display: 'none' }}>
            <img
              src={`${ASSET_BASE}racer.png`}
              alt="Master automotive engineering and precision vehicle diagnostics."
            />
          </div>
          <div className="cover__grid">
            {/* Cover Top Clearance Spacer for Fixed Nav */}
            <div className="cover__top-spacer ci" style={{ '--i': 0 } as React.CSSProperties} aria-hidden="true" />

            {/* Center / Mid-Hero Supporting Technical Metadata Layer */}
            <div
              className="hero-center"
              style={{
                opacity: heroTextOpacity,
                transition: 'opacity 0.15s ease-out',
                pointerEvents: heroTextOpacity < 0.1 ? 'none' : 'auto',
              }}
            >
              <div className="hero-kicker ci" style={{ '--i': 1 } as React.CSSProperties}>
                <span>AUTO SERVICE</span>
                <span className="hero-kicker__dot" aria-hidden="true">·</span>
                <span>MULTI-VEHICLE</span>
                <span className="hero-kicker__dot" aria-hidden="true">·</span>
                <span>PRECISION DIAGNOSTICS</span>
              </div>

              <div className="hero-flanks">
                <div className="hero-flank hero-flank--left ci" style={{ '--i': 2 } as React.CSSProperties}>
                  <div className="hero-flank__code">SPEC 84-01 // USA-OEM</div>
                  <div className="hero-flank__desc">ASE MASTER CERTIFIED &middot; EST 1984</div>
                </div>
                <div className="hero-flank hero-flank--right ci" style={{ '--i': 3 } as React.CSSProperties}>
                  <div className="hero-flank__code">TELEMETRY // CAN-FD &middot; DoIP</div>
                  <div className="hero-flank__desc">ACTIVE INTAKE STATUS: ONLINE</div>
                </div>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* ==================================== 02 · VEHICLES WE SERVICE */}
      <section
        ref={vehSectionRef}
        className="veh-section"
        id="face"
        aria-label="Vehicles We Service at Lanz Automobiles"
      >
        <div className="veh-container">
          {/* Left Column: Sticky Technical Overview Panel */}
          <div className="veh-left-sticky">
            <div>
              <div className="veh-header">
                <div className="veh-badge">
                  <span className="veh-badge__dot" aria-hidden="true"></span>
                  <span>VEHICLE RANGE // MULTI-VEHICLE SERVICE</span>
                </div>
                <div className="veh-main-title">
                  LANZ WORKSHOP DISCIPLINES &amp; PLATFORMS
                </div>
              </div>

              {/* Dynamic 01 / 04 Counter & Thin Mint Progress Line */}
              <div className="veh-counter-row" aria-live="polite">
                <span className="veh-counter-current mono">
                  {VEHICLES[activeVehIndex].counter}
                </span>
                <span className="veh-counter-divider">/</span>
                <span className="veh-counter-total mono">04</span>
              </div>

              <div
                className="veh-progress-track"
                role="progressbar"
                aria-valuenow={Math.round(vehProgress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Vehicle categories progress"
              >
                <div
                  className="veh-progress-fill"
                  style={{ width: `${Math.max(14, ((activeVehIndex + 1) / VEHICLES.length) * 100)}%` }}
                ></div>
              </div>

              {/* Active Category Content */}
              <div className="veh-body">
                <h2 className="veh-cat-name" id="veh-cat-title">
                  {VEHICLES[activeVehIndex].name}
                </h2>
                <div className="veh-cat-sub">
                  {VEHICLES[activeVehIndex].sub}
                </div>
                <p className="veh-cat-desc">
                  {VEHICLES[activeVehIndex].description}
                </p>

                {/* Technical Specification Table */}
                <div className="veh-specs">
                  {VEHICLES[activeVehIndex].specs.map((sp, idx) => (
                    <div key={idx} className="veh-spec-item">
                      <span className="veh-spec-lbl">{sp.label}:</span>
                      <span className="veh-spec-val mono">{sp.value}</span>
                    </div>
                  ))}
                  <div className="veh-spec-item">
                    <span className="veh-spec-lbl">BAY ASSIGNMENT:</span>
                    <span className="veh-spec-val mono" style={{ color: 'var(--action)' }}>
                      {VEHICLES[activeVehIndex].bays}
                    </span>
                  </div>
                </div>

                {/* Quick-Jump Category Buttons */}
                <div className="veh-tabs" role="group" aria-label="Select vehicle category">
                  {VEHICLES.map((v, idx) => (
                    <button
                      key={v.id}
                      type="button"
                      className={`veh-tab-btn ${idx === activeVehIndex ? 'is-active' : ''}`}
                      onClick={() => scrollToVehCard(idx)}
                      aria-label={`Jump to ${v.name}`}
                    >
                      {v.counter} {v.id.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions in Left Panel */}
            <div className="veh-actions">
              <button
                type="button"
                className="hero-btn hero-btn--primary veh-cta"
                onClick={() => scrollToSection('spec')}
                aria-label="View workshop services and tooling"
              >
                <span>VIEW SERVICES</span>
                <span className="hero-btn__arrow" aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                className="hero-btn hero-btn--secondary veh-cta"
                onClick={() => scrollToSection('estimator')}
                aria-label="Open instant estimate calculator"
              >
                ESTIMATE
              </button>
            </div>
          </div>

          {/* Right Column: Stacked Vehicle Cards */}
          <div className="veh-right-stack">
            {VEHICLES.map((v, i) => {
              const isUnder = i < activeVehIndex;
              const isActive = i === activeVehIndex;
              const distFromActive = Math.max(0, activeVehIndex - i);

              return (
                <div
                  key={v.id}
                  ref={(el) => { vehCardStepRefs.current[i] = el; }}
                  className="veh-card-step"
                >
                  <div
                    className={`veh-card ${isActive ? 'is-active' : ''} ${isUnder ? 'is-under' : ''}`}
                    style={{
                      '--card-index': i,
                      '--stack-top': `calc(clamp(70px, 10vh, 110px) + ${i * 26}px)`,
                      '--dist-from-active': distFromActive,
                      zIndex: 10 + i,
                    } as React.CSSProperties}
                  >
                    {/* Card Header Strip */}
                    <div className="veh-card__header">
                      <div className="veh-card__tag">
                        <span className="veh-card__tag-idx">[{v.counter}]</span>
                        <span>{v.tag}</span>
                      </div>
                      <div className="veh-card__status">
                        <span className="veh-card__pulse" aria-hidden="true"></span>
                        <span>{v.bays.split('(')[0].trim()}</span>
                      </div>
                    </div>

                    {/* Card Large Vehicle Media */}
                    <div className="veh-card__media">
                      <img
                        src={v.image}
                        alt={`${v.name} service - ${v.sub}`}
                        className="veh-card__img"
                        loading={i === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="veh-card__scrim" aria-hidden="true"></div>
                    </div>

                    {/* Card Footer Strip */}
                    <div className="veh-card__footer">
                      <div className="veh-card__footer-left">
                        <div className="veh-card__footer-name">
                          {v.name}
                        </div>
                        <div className="veh-card__footer-sub">
                          {v.sub}
                        </div>
                      </div>
                      <div className="veh-card__platforms">
                        {v.platforms.map((plat, pIdx) => (
                          <span key={pIdx} className="veh-card__chip">
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================ 03 · LANZ PERFORMANCE SYSTEM */}
      <section
        className="perf-system"
        id="trace"
        ref={perfSectionRef}
        aria-labelledby="perf-heading"
      >
        <div className="perf-ambient-grid" aria-hidden="true" />

        <div className="wrap">
          {/* Top Telemetry Header */}
          <div className="perf-head">
            <div className="perf-head__left">
              <div className="perf-eyebrow">
                <span className="perf-eyebrow__pulse" aria-hidden="true" />
                <span className="perf-eyebrow__code">PERFORMANCE / 04</span>
                <span className="perf-eyebrow__sep">/</span>
                <span className="perf-eyebrow__label">TELEMETRY SYSTEM</span>
              </div>
              <h2 id="perf-heading" className="perf-title">
                BUILT TO PERFORM.
              </h2>
            </div>

            <div className="perf-head__right">
              <p className="perf-desc">
                Precision engine calibration, real-time CAN-FD bus telemetry, and high-frequency sensor diagnostics. Every calibration is engineered to extract maximum tractive force while preserving thermal margins and powertrain integrity.
              </p>
              <div className="perf-status-pill">
                <span className="perf-status-dot" />
                <span className="perf-status-text">SYSTEM STATUS: OPTIMIZED</span>
              </div>
            </div>
          </div>

          {/* Compact Live-Style Metrics */}
          <div className="perf-metrics-strip" role="region" aria-label="Live Telemetry Metrics">
            <div className="perf-metric-cell is-active">
              <div className="perf-metric-top">
                <span className="perf-metric-lbl">RPM</span>
                <span className="perf-metric-code">CH-01</span>
              </div>
              <div className="perf-metric-val-wrap">
                <span className="perf-metric-num">{liveRpm.toLocaleString()}</span>
                <span className="perf-metric-unit">RPM</span>
              </div>
              <div className="perf-metric-foot">
                <div className="perf-metric-bar"><span style={{ width: '82%' }} /></div>
                <span className="perf-metric-sub">PEAK TRACTIVE BAND</span>
              </div>
            </div>

            <div className="perf-metric-cell is-highlight">
              <div className="perf-metric-top">
                <span className="perf-metric-lbl">SPEED</span>
                <span className="perf-metric-code">CH-02</span>
              </div>
              <div className="perf-metric-val-wrap">
                <span className="perf-metric-num hot">{liveSpeed}</span>
                <span className="perf-metric-unit hot">MPH</span>
              </div>
              <div className="perf-metric-foot">
                <div className="perf-metric-bar hot"><span style={{ width: '94%' }} /></div>
                <span className="perf-metric-sub">WIDE-OPEN THROTTLE</span>
              </div>
            </div>

            <div className="perf-metric-cell">
              <div className="perf-metric-top">
                <span className="perf-metric-lbl">POWER</span>
                <span className="perf-metric-code">CH-03</span>
              </div>
              <div className="perf-metric-val-wrap">
                <span className="perf-metric-num">740</span>
                <span className="perf-metric-unit">HP</span>
              </div>
              <div className="perf-metric-foot">
                <div className="perf-metric-bar"><span style={{ width: '88%' }} /></div>
                <span className="perf-metric-sub">DYNO VERIFIED @ FLYWHEEL</span>
              </div>
            </div>

            <div className="perf-metric-cell">
              <div className="perf-metric-top">
                <span className="perf-metric-lbl">TORQUE</span>
                <span className="perf-metric-code">CH-04</span>
              </div>
              <div className="perf-metric-val-wrap">
                <span className="perf-metric-num">685</span>
                <span className="perf-metric-unit">LB-FT</span>
              </div>
              <div className="perf-metric-foot">
                <div className="perf-metric-bar"><span style={{ width: '91%' }} /></div>
                <span className="perf-metric-sub">2,800 - 6,200 RPM FLAT PLATEAU</span>
              </div>
            </div>
          </div>

          {/* Center 16:9 Video Viewport */}
          <div className="perf-viewport-frame">
            {/* Corner Crosshairs */}
            <div className="perf-frame-corner perf-frame-corner--tl" aria-hidden="true" />
            <div className="perf-frame-corner perf-frame-corner--tr" aria-hidden="true" />
            <div className="perf-frame-corner perf-frame-corner--bl" aria-hidden="true" />
            <div className="perf-frame-corner perf-frame-corner--br" aria-hidden="true" />

            {/* Frame Top Header Rail */}
            <div className="perf-frame-bar">
              <div className="perf-frame-bar__left">
                <span className="perf-frame-tag">LANZ HUD OPTICAL LOG</span>
                <span className="perf-frame-sep">/</span>
                <span className="perf-frame-sub">DYNAMIC COCKPIT TELEMETRY</span>
              </div>
              <div className="perf-frame-bar__center">
                <span className="perf-frame-coord">LAT 46.5412° N / LONG 8.0031° E</span>
              </div>
              <div className="perf-frame-bar__right">
                <span className="perf-frame-rec-dot" />
                <span className="perf-frame-rec">REC [00:08.4]</span>
              </div>
            </div>

            {/* 16:9 Video Player */}
            <div className="perf-video-aspect">
              <video
                ref={perfVideoRef}
                src="https://res.cloudinary.com/b2s3bcgi/video/upload/v1790161121/Cinematic_Dashboard_Transition-ezremove_1.mp4"
                playsInline
                muted
                loop
                autoPlay
                preload="auto"
                controls={false}
                className="perf-video"
                aria-label="High performance digital automotive instrument cluster speedometer telemetry video"
              />
              <div className="perf-video-overlay" aria-hidden="true" />
            </div>

            {/* Frame Bottom Baseline Status */}
            <div className="perf-frame-bottom">
              <div className="perf-frame-bottom__meta">
                <span>SENSOR REFRESH: 1,000 HZ</span>
                <span>BUS LOAD: 28%</span>
                <span>CAN-FD PROTOCOL: SECURE</span>
              </div>
              <div className="perf-frame-bottom__legend">
                <span className="perf-legend-box" /> MINT #C7F500 ACTIVE TELEMETRY
              </div>
            </div>
          </div>

          {/* Below Video: Thin Technical Data Rail */}
          <div className="perf-rail-section">
            <div className="perf-rail-header">
              <span className="perf-rail-header__label">CALIBRATION PIPELINE PROTOCOL</span>
              <span className="perf-rail-header__indicator">
                STAGE {activeRailIndex + 1} OF {PERFORMANCE_RAIL.length}
              </span>
            </div>

            {/* Animated Progress Indicator Line */}
            <div className="perf-rail-progress-track" aria-hidden="true">
              <div
                className="perf-rail-progress-bar"
                style={{
                  width: `${((activeRailIndex + 1) / PERFORMANCE_RAIL.length) * 100}%`,
                }}
              />
              <div
                className="perf-rail-progress-glow"
                style={{
                  left: `${((activeRailIndex + 1) / PERFORMANCE_RAIL.length) * 100}%`,
                }}
              />
            </div>

            {/* 5 Technical Rail Items */}
            <div className="perf-rail-grid" role="tablist" aria-label="Performance Stages">
              {PERFORMANCE_RAIL.map((rail, idx) => {
                const isActive = activeRailIndex === idx;
                return (
                  <button
                    key={rail.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`perf-rail-item ${isActive ? 'is-active' : ''}`}
                    onClick={() => setActiveRailIndex(idx)}
                  >
                    <div className="perf-rail-item__top">
                      <span className="perf-rail-item__id">{rail.id}</span>
                      <span className="perf-rail-item__metric">{rail.metric}</span>
                    </div>
                    <div className="perf-rail-item__title">{rail.title}</div>
                    <div className="perf-rail-item__detail">{rail.detail}</div>
                    <div className="perf-rail-item__status">
                      <span className="perf-rail-item__indicator" />
                      <span>{rail.status}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Actions & Status Bar */}
            <div className="perf-bottom-bar">
              <div className="perf-bottom-bar__status">
                <span className="perf-status-ping" aria-hidden="true" />
                <span className="perf-bottom-status-text">
                  SYSTEM STATUS: <strong className="perf-mint">OPTIMIZED</strong>
                </span>
                <span className="perf-bottom-pipe">|</span>
                <span className="perf-bottom-note">ALL TELEMETRY CHANNELS OPERATIONAL</span>
              </div>

              <button
                type="button"
                className="perf-explore-btn"
                onClick={() => {
                  scrollToSection('spec');
                }}
              >
                <span>EXPLORE PERFORMANCE</span>
                <span className="perf-explore-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================= 04 · THE LANZ STANDARD */}
      <section
        className={`lanz-standard ${isStandardEntered ? 'is-entered' : ''}`}
        id="spec"
        ref={standardSectionRef}
        aria-labelledby="standard-h"
      >
        <div className="wrap">
          {/* Section Header */}
          <div className="lanz-standard__head">
            <div className="lanz-standard__head-left">
              <div className="lanz-standard__eyebrow">
                <span className="lanz-standard__eyebrow-dot" aria-hidden="true" />
                <span>THE LANZ STANDARD / 05</span>
              </div>
              <h2 id="standard-h" className="lanz-standard__title">
                <span className="lanz-mask-line">
                  <span className="lanz-mask-inner">NO GUESSWORK.</span>
                </span>
                <span className="lanz-mask-line">
                  <span className="lanz-mask-inner" style={{ color: 'var(--action)' }}>
                    JUST PRECISION.
                  </span>
                </span>
              </h2>
            </div>

            <div className="lanz-standard__head-right">
              <p className="lanz-standard__desc">
                Every vehicle starts with a proper diagnosis. We inspect, test, identify the fault, and explain the work before the repair begins.
              </p>
              <div className="lanz-standard__badge">
                <span className="lanz-standard__badge-ping" aria-hidden="true" />
                <span>LANZ PROTOCOL · VERIFIED CALIBRATION</span>
              </div>
            </div>
          </div>

          {/* Diagnostic Stage Canvas */}
          <div
            className="lanz-standard__stage"
            id="kit"
            role="region"
            aria-label="Interactive Diagnostic Analysis Interface"
          >
            {/* Corner Brackets */}
            <div className="lanz-stage-corner lanz-stage-corner--tl" aria-hidden="true" />
            <div className="lanz-stage-corner lanz-stage-corner--tr" aria-hidden="true" />
            <div className="lanz-stage-corner lanz-stage-corner--bl" aria-hidden="true" />
            <div className="lanz-stage-corner lanz-stage-corner--br" aria-hidden="true" />

            {/* Top Telemetry Rail */}
            <div className="lanz-stage-rail lanz-stage-rail--top" aria-hidden="true">
              <div>
                <span className="lanz-stage-rail__tag">DIAGNOSTIC TELEMETRY</span>
                <span> // 1,000 HZ CAN-FD BUS</span>
              </div>
              <div>STAGE: ACTIVE RUNTIME</div>
              <div>STATUS: NOMINAL</div>
            </div>

            {/* Central Dominant Visual: Exploded Performance Motorcycle Diagnostic Layer */}
            <div className="lanz-standard__bike-wrap" aria-hidden="true">
              {/* Subtle Diagnostic Scan Sweep across the filled container */}
              <div className="lanz-standard__scan-beam" />
            </div>

            {/* SVG Connector Lines */}
            <svg
              className="lanz-standard__lines"
              viewBox="0 0 1000 600"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Path 01: Diagnose (Top Left) */}
              <path
                d="M 370 210 L 285 210 L 285 100 L 239 100"
                className={`lanz-connector-path ${
                  hoveredCardIndex === 0
                    ? 'is-active'
                    : hoveredCardIndex !== null
                    ? 'is-subdued'
                    : ''
                }`}
              />

              {/* Path 02: Inspect (Bottom Left) */}
              <path
                d="M 270 410 L 255 410 L 255 500 L 239 500"
                className={`lanz-connector-path ${
                  hoveredCardIndex === 1
                    ? 'is-active'
                    : hoveredCardIndex !== null
                    ? 'is-subdued'
                    : ''
                }`}
              />

              {/* Path 03: Repair (Top Right) */}
              <path
                d="M 580 320 L 700 320 L 700 100 L 761 100"
                className={`lanz-connector-path ${
                  hoveredCardIndex === 2
                    ? 'is-active'
                    : hoveredCardIndex !== null
                    ? 'is-subdued'
                    : ''
                }`}
              />

              {/* Path 04: Verify (Bottom Right) */}
              <path
                d="M 790 390 L 775 390 L 775 500 L 761 500"
                className={`lanz-connector-path ${
                  hoveredCardIndex === 3
                    ? 'is-active'
                    : hoveredCardIndex !== null
                    ? 'is-subdued'
                    : ''
                }`}
              />
            </svg>

            {/* Precision Anchor Points */}
            <div className="lanz-standard__anchors">
              {LANZ_STANDARD_STEPS.map((step, idx) => {
                const isHovered = hoveredCardIndex === idx;
                const isSubdued = hoveredCardIndex !== null && !isHovered;
                return (
                  <button
                    key={step.id}
                    type="button"
                    className={`lanz-anchor ${isHovered ? 'is-active' : ''} ${
                      isSubdued ? 'is-subdued' : ''
                    }`}
                    style={{
                      left: `${step.anchor.x}%`,
                      top: `${step.anchor.y}%`,
                      transitionDelay: `${0.2 + idx * 0.1}s`,
                    }}
                    onMouseEnter={() => setHoveredCardIndex(idx)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                    onClick={() =>
                      setHoveredCardIndex((prev) => (prev === idx ? null : idx))
                    }
                    aria-label={`${step.stepNum} ${step.title}: ${step.anchor.label} ${step.anchor.sub}`}
                  >
                    <div className="lanz-anchor__reticle">
                      <div className="lanz-anchor__ring" />
                      <div className="lanz-anchor__dot" />
                      <div
                        className="lanz-anchor__ping"
                        style={{ animationDelay: `${idx * 0.75}s` }}
                      />
                    </div>
                    <span className="lanz-anchor__label">{step.anchor.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Glassy Technical UI Cards */}
            <div className="lanz-standard__cards">
              {LANZ_STANDARD_STEPS.map((step, idx) => {
                const isHovered = hoveredCardIndex === idx;
                const isSubdued = hoveredCardIndex !== null && !isHovered;
                const parallaxY = idx < 2 ? standardParallax : -standardParallax;

                return (
                  <div
                    key={step.id}
                    className={`lanz-card lanz-card--${idx} ${
                      isHovered ? 'is-active' : ''
                    } ${isSubdued ? 'is-subdued' : ''}`}
                    style={{
                      ...step.cardPos,
                      transitionDelay: `${0.35 + idx * 0.12}s`,
                      transform: isStandardEntered
                        ? `translate3d(0, ${parallaxY}px, 0)`
                        : undefined,
                    }}
                    onMouseEnter={() => setHoveredCardIndex(idx)}
                    onMouseLeave={() => setHoveredCardIndex(null)}
                    onClick={() =>
                      setHoveredCardIndex((prev) => (prev === idx ? null : idx))
                    }
                    role="button"
                    tabIndex={0}
                  >
                    <div className="lanz-card__top">
                      <div className="lanz-card__meta">
                        <span className="lanz-card__num">{step.stepNum}</span>
                        <span className="lanz-card__sep">/</span>
                        <span className="lanz-card__title-text">{step.title}</span>
                      </div>
                      <div className="lanz-card__icon-wrap">
                        {renderStandardIcon(step.id)}
                      </div>
                    </div>

                    <p className="lanz-card__copy">{step.copy}</p>

                    <div className="lanz-card__footer">
                      <span className="lanz-card__status-dot" aria-hidden="true" />
                      <span className="lanz-card__subtag">{step.subtag}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Telemetry Rail */}
            <div className="lanz-stage-rail lanz-stage-rail--bottom" aria-hidden="true">
              <div>TARGET: PERFORMANCE MOTO-CELL</div>
              <div>TOLERANCE: ±0.01 MM</div>
              <div>4 ANCHORS SYNCHRONIZED</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================== 05 · LANZ GLOBAL MASTER TECHNICIANS */}
      <section className="lanz-global-tech" id="technicians" aria-labelledby="tech-h">
        <div className="wrap lanz-tech-wrap">
          {/* Header */}
          <div className="lanz-tech-header">
            <div className="lanz-tech-header__left">
              <div className="lanz-tech-eyebrow">
                <span className="lanz-tech-eyebrow__bar" aria-hidden="true" />
                <span className="lanz-tech-eyebrow__tag">MASTER TECHNICIANS</span>
              </div>
              <h2 id="tech-h" className="lanz-tech-title">
                Sixty-eight specialists across all platforms.
              </h2>
              <div className="lanz-tech-subtag mono">
                LEAD DIAGNOSTIC TEAM — SHIFT ONE
              </div>
            </div>

            <div className="lanz-tech-header__right">
              <div className="lanz-tech-badge">
                <span className="lanz-tech-pulse-dot" aria-hidden="true" />
                <span className="lanz-tech-badge-txt">GLOBAL TEAM / 68 SPECIALISTS</span>
              </div>
              <div className="lanz-tech-coverage-strip" aria-label="Global regional specialists count">
                <span className="lanz-tech-cov-item"><b>NORTH AMERICA</b> 22</span>
                <span className="lanz-tech-cov-sep">·</span>
                <span className="lanz-tech-cov-item"><b>EUROPE</b> 18</span>
                <span className="lanz-tech-cov-sep">·</span>
                <span className="lanz-tech-cov-item"><b>ASIA</b> 12</span>
                <span className="lanz-tech-cov-sep">·</span>
                <span className="lanz-tech-cov-item"><b>REST OF WORLD</b> 16</span>
              </div>
            </div>
          </div>

          {/* Main 4x4 Grid Container */}
          <div className="lanz-tech-stage-container">
            <div className="lanz-tech-grid" role="list" aria-label="Master Technician Cards">
              {GLOBAL_TECHNICIANS.map((tech) => {
                const isFlipped = activeFlippedTechId === tech.id;
                return (
                  <div
                    key={tech.id}
                    role="listitem"
                    className={`lanz-tech-card-wrapper ${isFlipped ? 'is-flipped' : ''}`}
                    onClick={() => setActiveFlippedTechId(isFlipped ? null : tech.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setActiveFlippedTechId(isFlipped ? null : tech.id);
                      }
                    }}
                    tabIndex={0}
                    aria-label={`${tech.name}, ${tech.specialty}, ${tech.experienceYears} years experience, First-pass rate ${tech.firstPassRate}. Click or hover to flip for details.`}
                  >
                    <div className="lanz-tech-card-3d">
                      {/* FRONT FACE */}
                      <div className="lanz-tech-card-face lanz-tech-card-face--front">
                        <div className="lanz-tech-card-corner lanz-tech-card-corner--tl" aria-hidden="true" />
                        <div className="lanz-tech-card-corner lanz-tech-card-corner--br" aria-hidden="true" />

                        <div className="lanz-tech-card-top">
                          <div className="lanz-tech-card-flag-wrap">
                            <svg className="lanz-tech-flag" viewBox="0 0 3 2" role="img" aria-label={tech.country}>
                              {FLAG_PATHS[tech.countryCode] || <rect width="3" height="2" fill="#222932" />}
                            </svg>
                            <span className="lanz-tech-name">{tech.name}</span>
                          </div>
                          <span className="lanz-tech-nat-code mono">{tech.countryCode}</span>
                        </div>

                        {/* 2x2 Technical Metrics Matrix */}
                        <div className="lanz-tech-matrix">
                          <div className="lanz-tech-cell">
                            <span className="lanz-tech-cell-lbl mono">ASE MASTER CERTS</span>
                            <span className="lanz-tech-cell-val mono">{tech.aseCerts}</span>
                          </div>
                          <div className="lanz-tech-cell">
                            <span className="lanz-tech-cell-lbl mono">EXPERIENCE</span>
                            <span className="lanz-tech-cell-val mono">{tech.experienceYears} yrs</span>
                          </div>
                          <div className="lanz-tech-cell">
                            <span className="lanz-tech-cell-lbl mono">SPECIALTY</span>
                            <span className="lanz-tech-cell-val mono lanz-tech-specialty-txt">{tech.specialty}</span>
                          </div>
                          <div className="lanz-tech-cell">
                            <span className="lanz-tech-cell-lbl mono">FIRST-PASS RATE</span>
                            <span className="lanz-tech-cell-val mono lanz-tech-mint">{tech.firstPassRate}</span>
                          </div>
                        </div>

                        <div className="lanz-tech-card-footer">
                          <span className="lanz-tech-card-subtag mono">{tech.bay.split('·')[0].trim()}</span>
                          <span className="lanz-tech-flip-indicator mono" aria-hidden="true">
                            DETAILS <span className="lanz-tech-chevron">›</span>
                          </span>
                        </div>
                      </div>

                      {/* REVERSE FACE */}
                      <div className="lanz-tech-card-face lanz-tech-card-face--back">
                        <div className="lanz-tech-card-corner lanz-tech-card-corner--tl" aria-hidden="true" />
                        <div className="lanz-tech-card-corner lanz-tech-card-corner--br" aria-hidden="true" />

                        <div className="lanz-tech-back-header">
                          <div>
                            <div className="lanz-tech-back-bay mono">{tech.bay}</div>
                            <div className="lanz-tech-back-title">{tech.name}</div>
                          </div>
                          <span className="lanz-tech-back-badge mono">{tech.shift.split('·')[0].trim()}</span>
                        </div>

                        <div className="lanz-tech-back-certs">
                          <span className="lanz-tech-back-lbl mono">KEY QUALIFICATIONS //</span>
                          <ul className="lanz-tech-back-cert-list">
                            {tech.keyCerts.map((cert, cIdx) => (
                              <li key={cIdx}>
                                <span className="lanz-tech-back-dot" aria-hidden="true" />
                                <span>{cert}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="lanz-tech-back-footer">
                          <div className="lanz-tech-back-meta">
                            <span className="lanz-tech-back-calib mono">{tech.lifetimeCalibrations}</span>
                            <span className="lanz-tech-back-status mono">
                              <span className="lanz-tech-status-dot" aria-hidden="true" />
                              {tech.activeStatus}
                            </span>
                          </div>
                          <div className="lanz-tech-back-flip-hint mono">
                            <span>BACK ‹</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="lanz-tech-bottom-bar">
            <div className="lanz-tech-bottom-left">
              <span className="lanz-tech-pulse-dot" aria-hidden="true" />
              <span className="mono">
                <b>52 MORE</b> CERTIFIED SPECIALISTS &amp; SERVICE ADVISORS ON GLOBAL ROTATION
              </span>
            </div>
            <div className="lanz-tech-bottom-right mono">
              <span>ACTIVE DISPATCH COVERAGE: 100% FACTORY LEVEL</span>
              <span className="lanz-tech-bottom-pipe">|</span>
              <span style={{ color: '#C7F500' }}>ISO 9001 / ASE VERIFIED</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= 06 · CAR FIX COST ESTIMATOR */}
      <section className="lanz-estimator io" id="estimator" aria-labelledby="est-h">
        <div className="wrap">
          <div className="lanz-est-head">
            <div>
              <div className="label">Vehicle Repair Cost Estimator</div>
              <h2 id="est-h">Precision Repair &amp; Service Cost Calculation.</h2>
              <p className="lede">
                Real-time OEM standard book labor hours and factory parts pricing. Select your vehicle architecture and required service disciplines below.
              </p>
            </div>
            <div className="lanz-est-head-meta mono">
              <span className="lanz-est-status-dot" aria-hidden="true" />
              <span>LIVE ESTIMATE ENGINE · 2026 OEM RATES</span>
            </div>
          </div>

          <div className="lanz-est-grid">
            {/* Left Card: Automotive visual + selectable options */}
            <div className="lanz-est-card lanz-est-left">
              <span className="lanz-est-reg lanz-est-reg--tl" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--tr" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--bl" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--br" aria-hidden="true" />

              {/* Vehicle Platform Hero Visual */}
              <div className="lanz-est-visual-wrap">
                <img
                  src={estimatorCarImg}
                  alt="LANZ Precision Automotive Engineering vehicle platform"
                  className="lanz-est-car-img"
                />
                <div className="lanz-est-visual-overlay" />
                <div className="lanz-est-visual-scanline" />

                <div className="lanz-est-visual-topbar mono">
                  <span className="lanz-est-badge">PLATFORM // {currentPlatform.name}</span>
                  <span className="lanz-est-badge lanz-est-badge--dim">{currentPlatform.sub}</span>
                </div>

                {/* Platform Selector Tabs */}
                <div className="lanz-est-platform-selector">
                  {(['coupe', 'sedan', 'suv', 'truck'] as const).map((pKey) => {
                    const info = PLATFORM_MULTIPLIERS[pKey];
                    const isSelected = estimatorPlatform === pKey;
                    return (
                      <button
                        key={pKey}
                        type="button"
                        className={`lanz-est-platform-btn mono ${isSelected ? 'is-active' : ''}`}
                        onClick={() => setEstimatorPlatform(pKey)}
                      >
                        <span className="lanz-est-platform-indicator" />
                        <span className="lanz-est-platform-name">{info.name}</span>
                        <span className="lanz-est-platform-mult">({info.mult.toFixed(2)}x)</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selectable Repair & Service Options Grid */}
              <div className="lanz-est-services-container">
                <div className="lanz-est-services-header">
                  <div className="lanz-est-services-title mono">
                    <span>SELECT SERVICE DISCIPLINES</span>
                    <span className="lanz-est-count-pill">{selectedEstimatorServices.length} ACTIVE</span>
                  </div>
                  <div className="lanz-est-services-actions">
                    <button
                      type="button"
                      className="lanz-est-link-btn mono"
                      onClick={() => setSelectedEstimatorServices(ESTIMATOR_SERVICES.map((s) => s.id))}
                    >
                      [SELECT ALL]
                    </button>
                    <span className="lanz-est-sep">/</span>
                    <button
                      type="button"
                      className="lanz-est-link-btn mono"
                      onClick={() => setSelectedEstimatorServices([])}
                    >
                      [CLEAR]
                    </button>
                  </div>
                </div>

                <div className="lanz-est-services-grid">
                  {ESTIMATOR_SERVICES.map((srv) => {
                    const isSelected = selectedEstimatorServices.includes(srv.id);
                    const dynamicPrice = Math.round(srv.price * currentPlatform.mult);
                    return (
                      <button
                        key={srv.id}
                        type="button"
                        className={`lanz-est-service-item ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => toggleEstimatorService(srv.id)}
                        aria-pressed={isSelected}
                      >
                        <div className="lanz-est-srv-header">
                          <span className="lanz-est-srv-code mono">{srv.code}</span>
                          <span className="lanz-est-srv-cat mono">{srv.category}</span>
                          <span className={`lanz-est-srv-check ${isSelected ? 'is-checked' : ''}`} aria-hidden="true">
                            {isSelected ? '✓' : '+'}
                          </span>
                        </div>
                        <div className="lanz-est-srv-name">{srv.name}</div>
                        <div className="lanz-est-srv-desc">{srv.desc}</div>
                        <div className="lanz-est-srv-foot mono">
                          <span className="lanz-est-srv-time">⚡ {srv.laborTime}</span>
                          <span className="lanz-est-srv-price">${dynamicPrice}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Card: Glass Price Display & Itemized Telemetry */}
            <div className="lanz-est-card lanz-est-right">
              <span className="lanz-est-reg lanz-est-reg--tl" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--tr" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--bl" aria-hidden="true" />
              <span className="lanz-est-reg lanz-est-reg--br" aria-hidden="true" />

              <div className="lanz-est-glass-inner">
                <div className="lanz-est-right-header">
                  <span className="lanz-est-tag mono">ESTIMATED REPAIR COST // LANZ PROTOCOL</span>
                  <span className="lanz-est-dot-live" />
                </div>

                <div className="lanz-est-price-container">
                  <div className="lanz-est-price-val mono" key={estimatedTotalCost}>
                    ${estimatedTotalCost.toLocaleString()}
                  </div>
                  <div className="lanz-est-price-meta mono">
                    <span>COEFFICIENT: {currentPlatform.mult.toFixed(2)}x</span>
                    <span className="lanz-est-pipe">|</span>
                    <span>{selectedServicesList.length} DISCIPLINES SELECTED</span>
                  </div>
                </div>

                {/* Selected Breakdown Box */}
                <div className="lanz-est-breakdown-box">
                  <div className="lanz-est-breakdown-title mono">ITEMIZED WORK ORDER SCOPE:</div>
                  {selectedServicesList.length === 0 ? (
                    <div className="lanz-est-empty-state mono">
                      <span>NO SERVICES SELECTED</span>
                      <p>Select one or more service disciplines on the left to generate real-time labor, parts, and calibration telemetry.</p>
                    </div>
                  ) : (
                    <div className="lanz-est-breakdown-list">
                      {selectedServicesList.map((srv) => (
                        <div key={srv.id} className="lanz-est-breakdown-row">
                          <div className="lanz-est-breakdown-left">
                            <span className="lanz-est-breakdown-code mono">{srv.code}</span>
                            <span className="lanz-est-breakdown-name">{srv.name}</span>
                          </div>
                          <span className="lanz-est-breakdown-cost mono">
                            ${Math.round(srv.price * currentPlatform.mult)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technical Engineering Specs Table */}
                <div className="lanz-est-specs-table mono">
                  <div className="lanz-est-spec-row">
                    <span>ESTIMATED BOOK LABOR:</span>
                    <span className="lanz-est-spec-val">{estimatedLaborTime} Hours</span>
                  </div>
                  <div className="lanz-est-spec-row">
                    <span>OEM FACTORY PARTS:</span>
                    <span className="lanz-est-spec-val">Certified Original</span>
                  </div>
                  <div className="lanz-est-spec-row">
                    <span>FIRST-PASS GUARANTEE:</span>
                    <span className="lanz-est-spec-val">99.4% Verified</span>
                  </div>
                  <div className="lanz-est-spec-row">
                    <span>WARRANTY COVERAGE:</span>
                    <span className="lanz-est-spec-val" style={{ color: '#C7F500' }}>36 Mo / 36,000 Mi</span>
                  </div>
                </div>

                <p className="lanz-est-disclaimer">
                  *Estimated figure based on OEM standard book labor hours and certified master technician rates. Final diagnostic confirmation locked on physical bay intake.
                </p>

                <div className="lanz-est-action-wrap">
                  <button
                    type="button"
                    className="hero-btn hero-btn--primary lanz-est-main-cta"
                    onClick={() => setIsBookingModalOpen(true)}
                  >
                    <span>REQUEST SERVICE</span>
                    <span className="hero-btn__arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= 07 · CUSTOMER TESTIMONIALS */}
      <section className="lanz-testimonials io" id="testimonials" aria-labelledby="testi-h">
        <div className="wrap">
          <div className="lanz-testi-head">
            <div>
              <div className="label">Verified Client Logs</div>
              <h2 id="testi-h">Documented repairs. Measurable precision.</h2>
              <p className="lede">
                Real telemetry, verified diagnostics, and first-pass audit results from certified performance and commercial vehicle owners.
              </p>
            </div>
            <div className="lanz-testi-counter mono">
              <span style={{ color: '#C7F500' }}>0{activeTestimonialIdx + 1}</span>
              <span className="lanz-testi-sep">/</span>
              <span>0{TESTIMONIALS.length}</span>
            </div>
          </div>

          {/* Main Editorial Testimonial Display */}
          <div className="lanz-testi-card">
            <span className="lanz-testi-bg-num mono" aria-hidden="true">
              0{activeTestimonialIdx + 1}
            </span>

            <div className="lanz-testi-top-bar mono">
              <div className="lanz-testi-badge">
                <span className="lanz-testi-dot" />
                <span>{TESTIMONIALS[activeTestimonialIdx].archiveCode}</span>
              </div>
              <div className="lanz-testi-rating">
                {TESTIMONIALS[activeTestimonialIdx].rating}
              </div>
            </div>

            <blockquote className="lanz-testi-quote">
              &ldquo;{TESTIMONIALS[activeTestimonialIdx].quote}&rdquo;
            </blockquote>

            <div className="lanz-testi-meta-grid">
              <div className="lanz-testi-author-block">
                <div className="lanz-testi-author-name">{TESTIMONIALS[activeTestimonialIdx].author}</div>
                <div className="lanz-testi-author-role mono">{TESTIMONIALS[activeTestimonialIdx].role}</div>
              </div>

              <div className="lanz-testi-vehicle-block">
                <span className="lanz-testi-pill mono">VEHICLE</span>
                <span className="lanz-testi-vehicle-title">{TESTIMONIALS[activeTestimonialIdx].vehicle}</span>
              </div>

              <div className="lanz-testi-service-block">
                <span className="lanz-testi-pill mono">SERVICE LOG</span>
                <span className="lanz-testi-service-title">{TESTIMONIALS[activeTestimonialIdx].service}</span>
              </div>

              <div className="lanz-testi-telemetry-block">
                <span className="lanz-testi-pill mono">AUDIT RESULT</span>
                <span className="lanz-testi-metric mono">{TESTIMONIALS[activeTestimonialIdx].metric}</span>
              </div>
            </div>

            {/* Editorial Tab Switcher */}
            <div className="lanz-testi-nav-bar">
              <div className="lanz-testi-tabs">
                {TESTIMONIALS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`lanz-testi-tab mono ${activeTestimonialIdx === idx ? 'is-active' : ''}`}
                    onClick={() => setActiveTestimonialIdx(idx)}
                  >
                    <span className="lanz-testi-tab-idx">0{idx + 1}</span>
                    <span className="lanz-testi-tab-name">{item.author}</span>
                  </button>
                ))}
              </div>

              <div className="lanz-testi-arrows">
                <button
                  type="button"
                  className="lanz-testi-arrow-btn"
                  onClick={() =>
                    setActiveTestimonialIdx((prev) => (prev > 0 ? prev - 1 : TESTIMONIALS.length - 1))
                  }
                  aria-label="Previous Testimonial"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="lanz-testi-arrow-btn"
                  onClick={() =>
                    setActiveTestimonialIdx((prev) => (prev < TESTIMONIALS.length - 1 ? prev + 1 : 0))
                  }
                  aria-label="Next Testimonial"
                >
                  →
                </button>
              </div>
            </div>
          </div>

          {/* Trust Metrics Bar */}
          <div className="lanz-testi-stats-grid">
            <div className="lanz-testi-stat-card">
              <div className="lanz-testi-stat-num mono">99.4%</div>
              <div className="lanz-testi-stat-label mono">FIRST-PASS RESOLUTION ACCURACY</div>
            </div>
            <div className="lanz-testi-stat-card">
              <div className="lanz-testi-stat-num mono">3,840+</div>
              <div className="lanz-testi-stat-label mono">DIGITALLY VERIFIED WORK ORDERS</div>
            </div>
            <div className="lanz-testi-stat-card">
              <div className="lanz-testi-stat-num mono">36-MO</div>
              <div className="lanz-testi-stat-label mono">NATIONWIDE REPAIR WARRANTY</div>
            </div>
            <div className="lanz-testi-stat-card">
              <div className="lanz-testi-stat-num mono">0.0%</div>
              <div className="lanz-testi-stat-label mono">UNAUTHORIZED BILLING SURPRISES</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================= 08 · FREQUENTLY ASKED QUESTIONS */}
      <section className="lanz-faq io" id="faq" aria-labelledby="faq-h">
        <div className="wrap">
          <div className="lanz-faq-head">
            <div>
              <div className="label">Service Intake Protocol</div>
              <h2 id="faq-h">Frequently asked questions.</h2>
              <p className="lede">
                Clear answers regarding factory diagnostics, turnaround schedules, warranty coverage, and estimate guarantees.
              </p>
            </div>
            <div className="lanz-faq-head-tag mono">
              <span>8 PROTOCOL ENTRIES</span>
            </div>
          </div>

          <div className="lanz-faq-grid">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaqIdx === idx;
              return (
                <div
                  key={faq.num}
                  className={`lanz-faq-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    className="lanz-faq-trigger"
                    onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                  >
                    <div className="lanz-faq-trigger-left">
                      <span className="lanz-faq-num mono">{faq.num}</span>
                      <span className="lanz-faq-cat mono">{faq.category}</span>
                      <h3 className="lanz-faq-question">{faq.question}</h3>
                    </div>
                    <span className="lanz-faq-icon mono" aria-hidden="true">
                      {isOpen ? '—' : '+'}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="lanz-faq-body">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Support Banner */}
          <div className="lanz-faq-banner">
            <div className="lanz-faq-banner-text">
              <div className="lanz-faq-banner-title">HAVE A COMPLEX FAULT OR CUSTOM FLEET REQUIREMENT?</div>
              <p className="lanz-faq-banner-sub">
                Our ASE Master Certified diagnosticians are available for direct engineering consultations and priority bay scheduling.
              </p>
            </div>
            <div className="lanz-faq-banner-actions">
              <button
                type="button"
                className="hero-btn hero-btn--secondary"
                onClick={() => scrollToSection('estimator')}
              >
                RECALCULATE ESTIMATE
              </button>
              <button
                type="button"
                className="hero-btn hero-btn--primary"
                onClick={() => setIsBookingModalOpen(true)}
              >
                <span>BOOK SERVICE BAY</span>
                <span className="hero-btn__arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================== FOOTER */}
      <footer className="lanz-footer" aria-label="Site Footer">
        <div className="wrap">
          {/* Footer Top Brand & Direct Telemetry Bar */}
          <div className="lanz-footer-top">
            <div className="lanz-footer-brand">
              <a
                href="#"
                className="lanz-footer-wordmark"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span className="lanz-footer-dot" aria-hidden="true" />
                LANZ AUTOMOBILES
              </a>
              <span className="lanz-footer-est mono">EST. 1984 · MASTER WORKSHOP &amp; ENGINEERING</span>
              <p className="lanz-footer-desc">
                Precision vehicle diagnostics, factory scheduled maintenance, powertrain overhauls, and dynamometer calibration for high-performance automobiles, motorcycles, and commercial vehicle fleets.
              </p>
            </div>

            <div className="lanz-footer-telemetry-grid mono">
              <div className="lanz-footer-telemetry-item">
                <span className="lanz-footer-tel-label">DIRECT INTAKE HOTLINE</span>
                <a href="tel:+18005555269" className="lanz-footer-tel-val">
                  +1 (800) 555-LANZ
                </a>
              </div>
              <div className="lanz-footer-telemetry-item">
                <span className="lanz-footer-tel-label">ENGINEERING DISPATCH</span>
                <a href="mailto:dispatch@lanzautomobiles.com" className="lanz-footer-tel-val">
                  dispatch@lanzautomobiles.com
                </a>
              </div>
              <div className="lanz-footer-telemetry-item">
                <span className="lanz-footer-tel-label">MASTER FACILITY ID</span>
                <span className="lanz-footer-tel-val" style={{ color: '#C7F500' }}>
                  US-FAC-LA8401 (WINGS 1–4)
                </span>
              </div>
              <div className="lanz-footer-telemetry-item">
                <span className="lanz-footer-tel-label">CAMPUS STATUS</span>
                <span className="lanz-footer-tel-status">
                  <span className="lanz-footer-live-indicator" /> ALL 32 BAYS OPERATIONAL
                </span>
              </div>
            </div>
          </div>

          {/* Footer 4-Column Directory Grid */}
          <div className="lanz-footer-nav-grid">
            {/* Column 1: Capabilities */}
            <div className="lanz-footer-col">
              <h3 className="lanz-footer-col-title mono">WORKSHOP CAPABILITIES</h3>
              <ul className="lanz-footer-links">
                <li>
                  <a
                    href="#estimator"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('estimator');
                    }}
                  >
                    Powertrain Diagnostics &amp; ECU Scan
                  </a>
                </li>
                <li>
                  <a
                    href="#spec"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('spec');
                    }}
                  >
                    3D Laser Alignment &amp; Damping Audit
                  </a>
                </li>
                <li>
                  <a
                    href="#estimator"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('estimator');
                    }}
                  >
                    Brake Hydraulics &amp; Precision Lathe
                  </a>
                </li>
                <li>
                  <a
                    href="#estimator"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('estimator');
                    }}
                  >
                    Engine &amp; Transmission Overhaul
                  </a>
                </li>
                <li>
                  <a
                    href="#face"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('face');
                    }}
                  >
                    Commercial Truck Fleet Maintenance
                  </a>
                </li>
                <li>
                  <a
                    href="#face"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('face');
                    }}
                  >
                    Motorcycle Dynamometer Calibration
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 2: Protocol & Quality */}
            <div className="lanz-footer-col">
              <h3 className="lanz-footer-col-title mono">STANDARDS &amp; PROTOCOL</h3>
              <ul className="lanz-footer-links">
                <li>
                  <a
                    href="#technicians"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('technicians');
                    }}
                  >
                    ASE Master Certified Protocol
                  </a>
                </li>
                <li>
                  <a
                    href="#spec"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('spec');
                    }}
                  >
                    ISO 9001:2015 Quality Standards
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('testimonials');
                    }}
                  >
                    36-Month / 36,000-Mile Warranty
                  </a>
                </li>
                <li>
                  <a
                    href="#testimonials"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('testimonials');
                    }}
                  >
                    99.4% First-Pass Resolution Rate
                  </a>
                </li>
                <li>
                  <a
                    href="#spec"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('spec');
                    }}
                  >
                    OEM Certified Replacement Parts
                  </a>
                </li>
                <li>
                  <a
                    href="#estimator"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection('estimator');
                    }}
                  >
                    Transparent Book Labor Calculator
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Facility Hours & Campus */}
            <div className="lanz-footer-col">
              <h3 className="lanz-footer-col-title mono">FACILITY &amp; INTAKE HOURS</h3>
              <div className="lanz-footer-hours-list mono">
                <div className="lanz-footer-hour-row">
                  <span>MON – FRI</span>
                  <span className="lanz-footer-hour-val">06:30 – 19:30 EST</span>
                </div>
                <div className="lanz-footer-hour-row">
                  <span>SATURDAY</span>
                  <span className="lanz-footer-hour-val">07:30 – 16:00 EST</span>
                </div>
                <div className="lanz-footer-hour-row">
                  <span>SUNDAY</span>
                  <span className="lanz-footer-hour-val" style={{ color: 'var(--snow-500)' }}>
                    Emergency Dispatch
                  </span>
                </div>
                <div className="lanz-footer-hour-row">
                  <span>TOWING INTAKE</span>
                  <span className="lanz-footer-hour-val" style={{ color: '#C7F500' }}>
                    24/7 Gate Drop Available
                  </span>
                </div>
              </div>
              <div className="lanz-footer-address">
                <p>8401 Industrial Parkway, Bay Wings 1–4</p>
                <p>Engineering &amp; Fleet Logistics Hub, US</p>
              </div>
            </div>

            {/* Column 4: Service Bulletins & Fast Actions */}
            <div className="lanz-footer-col">
              <h3 className="lanz-footer-col-title mono">TECHNICAL SERVICE BULLETINS</h3>
              <p className="lanz-footer-col-desc">
                Receive factory recall updates, seasonal fluid advisories, and certified service bulletins directly from our master engineers.
              </p>

              {newsletterSuccess ? (
                <div className="lanz-footer-success mono">
                  <span style={{ color: '#C7F500' }}>✓ DISPATCH SUBSCRIPTION ACTIVE</span>
                  <p>Advisories will be delivered to {newsletterEmail || 'your email'}.</p>
                </div>
              ) : (
                <form
                  className="lanz-footer-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (newsletterEmail) setNewsletterSuccess(true);
                  }}
                >
                  <input
                    type="email"
                    required
                    placeholder="engineer@domain.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="lanz-footer-input mono"
                    aria-label="Email for technical service bulletins"
                  />
                  <button type="submit" className="lanz-footer-submit-btn mono">
                    JOIN
                  </button>
                </form>
              )}

              <div className="lanz-footer-quick-actions">
                <button
                  type="button"
                  className="hero-btn hero-btn--secondary"
                  onClick={() => scrollToSection('estimator')}
                >
                  CALCULATE ESTIMATE
                </button>
                <button
                  type="button"
                  className="hero-btn hero-btn--primary"
                  onClick={() => setIsBookingModalOpen(true)}
                >
                  <span>BOOK SERVICE BAY</span>
                  <span className="hero-btn__arrow" aria-hidden="true">→</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom Colophon & Compliance */}
          <div className="lanz-footer-bottom">
            <div className="lanz-footer-bottom-left mono">
              <span>&copy; {new Date().getFullYear()} LANZ AUTOMOBILES INC. ALL RIGHTS RESERVED.</span>
              <span className="lanz-footer-bottom-sep">|</span>
              <span>EPA TIER-4 ECO COMPLIANCE</span>
              <span className="lanz-footer-bottom-sep">|</span>
              <span>BOSCH &amp; BREMBO TECHNICAL PARTNER</span>
            </div>

            <div className="lanz-footer-bottom-links mono">
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
              >
                TERMS OF REPAIR
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
              >
                ESTIMATE GUARANTEE
              </a>
              <a
                href="#faq"
                onClick={(e) => {
                  e.preventDefault();
                  scrollToSection('faq');
                }}
              >
                DISPUTE PROTOCOL
              </a>
              <button
                type="button"
                className="lanz-footer-top-btn"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Scroll back to top of page"
              >
                [ ↑ TOP ]
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ===================================== BOOKING & SERVICE MODAL */}
      {isBookingModalOpen && (
        <div
          className="est-backdrop"
          onClick={() => setIsBookingModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="bookTitle"
        >
          <div
            className="est-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="est-head">
              <div className="est-head__title" id="bookTitle">
                <span className="est-head__dot"></span>
                LANZ AUTOMOBILES · SERVICE BAY RESERVATION
              </div>
              <button
                type="button"
                className="est-close"
                onClick={() => setIsBookingModalOpen(false)}
                aria-label="Close booking dialog"
              >
                [ESC ✕]
              </button>
            </div>

            {bookingSuccess ? (
              <div className="lanz-booking-success mono">
                <div className="lanz-success-icon">✓</div>
                <h3>SERVICE BAY RESERVATION CONFIRMED</h3>
                <p>
                  Work Order <b>#WO-2026-{Math.floor(1000 + Math.random() * 9000)}</b> registered into the LANZ Intake Queue. A master service advisor will contact you with diagnostic bay allocation.
                </p>
                <div className="lanz-success-meta">
                  <span>ESTIMATED TOTAL: ${estimatedTotalCost.toLocaleString()}</span>
                  <span>PLATFORM: {currentPlatform.name}</span>
                </div>
              </div>
            ) : (
              <form onSubmit={handleBookingSubmit}>
                <div className="est-body">
                  <div className="est-section">
                    <span className="est-label">SELECTED SERVICE SCOPE &amp; ESTIMATE</span>
                    <div className="lanz-modal-scope-summary mono">
                      <div className="lanz-modal-scope-row">
                        <span>PLATFORM:</span>
                        <span style={{ color: '#fff' }}>{currentPlatform.name} ({currentPlatform.sub})</span>
                      </div>
                      <div className="lanz-modal-scope-row">
                        <span>SERVICES ({selectedServicesList.length}):</span>
                        <span style={{ color: '#fff' }}>
                          {selectedServicesList.map((s) => s.name).join(', ') || 'General Intake Inspection'}
                        </span>
                      </div>
                      <div className="lanz-modal-scope-row is-total">
                        <span>ESTIMATED WORK ORDER:</span>
                        <span className="est-val">${estimatedTotalCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="est-section">
                    <span className="est-label">CLIENT &amp; VEHICLE DETAILS</span>
                    <div className="lanz-modal-form-grid">
                      <div className="lanz-input-group">
                        <label className="mono">FULL NAME</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robert Sterling"
                          value={bookingName}
                          onChange={(e) => setBookingName(e.target.value)}
                          className="lanz-input"
                        />
                      </div>
                      <div className="lanz-input-group">
                        <label className="mono">CONTACT EMAIL / PHONE</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. robert@example.com / (555) 019-2834"
                          value={bookingContact}
                          onChange={(e) => setBookingContact(e.target.value)}
                          className="lanz-input"
                        />
                      </div>
                      <div className="lanz-input-group lanz-input-group--full">
                        <label className="mono">VEHICLE YEAR, MAKE &amp; MODEL (OPTIONAL VIN)</label>
                        <input
                          type="text"
                          placeholder="e.g. 2023 Porsche 911 GT3 / 2021 Ford F-250 Super Duty"
                          value={bookingVehicleDetails}
                          onChange={(e) => setBookingVehicleDetails(e.target.value)}
                          className="lanz-input"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="est-foot">
                  <button
                    type="button"
                    className="hero-btn hero-btn--secondary"
                    onClick={() => setIsBookingModalOpen(false)}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="hero-btn hero-btn--primary"
                  >
                    <span>CONFIRM BAY RESERVATION</span>
                    <span className="hero-btn__arrow" aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
