# Embedded Master 🚀

## Interactive Embedded Systems Learning & Engineering Workspace

**Understand embedded systems from architecture to firmware — then practice the engineering workflow.**

Embedded Master is a browser-based React application intended to organize practical embedded-systems learning, experiments and engineering references in one workspace.

The project is being developed as a hands-on companion for engineers working with **embedded C, MCU architecture, firmware, peripherals, Linux-oriented concepts and hardware/software debugging**.

---

## 🎯 Project Goal

The objective is to create a single workspace where an embedded engineer can move through:

```text
Concept
  ↓
Architecture
  ↓
Code
  ↓
Experiment
  ↓
Observe
  ↓
Debug
  ↓
Validate
```

The project complements real boards and laboratory equipment; it is not intended to claim that browser simulation replaces physical validation.

---

## 🧩 Current Architecture

The repository is a Vite-based React application. The source tree contains reusable components, configuration, application context, data and page-level modules. fileciteturn57file0

```text
Embedded_Master/
│
├── src/
│   ├── components/      # Reusable UI components
│   ├── config/          # Application configuration
│   ├── context/         # Shared application state
│   ├── data/            # Learning / application data
│   ├── pages/           # Application pages
│   ├── App.jsx          # Main application
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styling
│
├── public/              # Static assets, where applicable
├── index.html
├── firebase.json        # Firebase configuration
├── .firebaserc          # Firebase project configuration
├── vite.config.js
└── package.json
```

---

## 🛠️ Technology Stack

The current application uses:

- React 18
- JavaScript / JSX
- Vite
- React Router
- CodeMirror with C/C++ language support
- Lucide React
- Firebase

These dependencies are defined in the current project configuration. fileciteturn56file0

---

## 🔬 Engineering Areas

The platform is intended to grow around the areas most useful to embedded engineers:

### Embedded Fundamentals

- Embedded C
- Memory and registers
- Bit manipulation
- Interrupts
- Timers
- GPIO
- DMA
- MCU architecture

### Firmware

- Firmware structure
- Register-level programming
- Peripheral configuration
- State machines
- Non-blocking firmware patterns
- Debugging techniques

### Communication Interfaces

- UART
- I2C
- SPI
- CAN
- USB
- Other interfaces as the project evolves

### Embedded Linux

- Linux fundamentals
- Boot flow
- Device Tree
- Kernel concepts
- Device drivers
- I2C / SPI / UART driver concepts

### Validation

- Test-case design
- Register validation
- Functional validation
- Protocol analysis
- Failure injection
- Root-cause debugging

---

## 💻 Development

### Prerequisites

- Node.js
- npm
- Git

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build production application

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

---

## 🗺️ Roadmap

### Foundation

- [x] React/Vite application foundation
- [x] Modular application structure
- [ ] Formal learning-content model
- [ ] Improved project navigation

### Embedded Learning

- [ ] Embedded C playground
- [ ] MCU architecture visualizations
- [ ] Register and memory exercises
- [ ] Interrupt experiments
- [ ] Peripheral configuration exercises

### Protocol Labs

- [ ] UART lab
- [ ] I2C lab
- [ ] SPI lab
- [ ] CAN lab
- [ ] Protocol waveform visualization

### Validation Labs

- [ ] Guided validation workflows
- [ ] Test-case generation
- [ ] Failure scenarios
- [ ] Register inspection
- [ ] Debugging exercises

### Hardware Integration

- [ ] Connect selected exercises to development boards
- [ ] Capture real peripheral data
- [ ] Compare simulated vs measured behavior
- [ ] Add board-specific lab manuals

---

## 🔗 Relationship to the Portfolio

Embedded Master is part of a broader embedded-engineering portfolio:

```text
Think Silicon Academy
        │
        ├── Structured learning platform
        │
        ▼
Embedded Master
        │
        ├── Engineering workspace
        │
        ▼
ES-Tools
        │
        ├── Interactive simulations / validation bench
        │
        ▼
Physical Boards + Instruments
        │
        └── Real hardware validation
```

The long-term goal is to connect **learning, simulation and real hardware practice** into one coherent engineering path.

---

## 📌 Status

**Active development / evolving project.**

Some capabilities described in the roadmap are planned rather than currently implemented. The repository should be treated as an evolving engineering workspace.

---

## 👨‍💻 Author

**Siva Rami Reddy**

Embedded Systems Engineer focused on **Post-Silicon Validation, Embedded Linux, Linux Device Drivers, ARM, SoC architecture and hardware/software debugging**.

GitHub: https://github.com/sivaramireddy18
