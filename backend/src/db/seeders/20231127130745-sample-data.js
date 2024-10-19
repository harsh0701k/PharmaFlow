const db = require('../models');
const Users = db.users;

const Appointments = db.appointments;

const Inventories = db.inventories;

const Organizations = db.organizations;

const Patients = db.patients;

const Prescriptions = db.prescriptions;

const Organization = db.organization;

const AppointmentsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    appointment_date: new Date('2023-10-10T09:00:00'),

    location: 'City Hospital',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    appointment_date: new Date('2023-10-11T10:30:00'),

    location: 'Green Valley Clinic',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    appointment_date: new Date('2023-10-12T11:00:00'),

    location: 'Downtown Health Center',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    appointment_date: new Date('2023-10-13T14:00:00'),

    location: 'Lakeside Medical',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    appointment_date: new Date('2023-10-14T15:30:00'),

    location: 'Suburban Wellness',

    // type code here for "relation_one" field
  },
];

const InventoriesData = [
  {
    medicine_name: 'Amoxicillin',

    quantity: 100,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    medicine_name: 'Ibuprofen',

    quantity: 200,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    medicine_name: 'Metformin',

    quantity: 150,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    medicine_name: 'Lisinopril',

    quantity: 80,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    medicine_name: 'Atorvastatin',

    quantity: 120,

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'City Hospital',

    address: '123 Main St, Metropolis',

    // type code here for "relation_many" field
  },

  {
    name: 'Green Valley Clinic',

    address: '456 Elm St, Green Valley',

    // type code here for "relation_many" field
  },

  {
    name: 'Downtown Health Center',

    address: '789 Oak St, Downtown',

    // type code here for "relation_many" field
  },

  {
    name: 'Lakeside Medical',

    address: '101 Pine St, Lakeside',

    // type code here for "relation_many" field
  },

  {
    name: 'Suburban Wellness',

    address: '202 Maple St, Suburbia',

    // type code here for "relation_many" field
  },
];

const PatientsData = [
  {
    first_name: 'Alice',

    last_name: 'Brown',

    date_of_birth: new Date('1985-06-15'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'Bob',

    last_name: 'White',

    date_of_birth: new Date('1990-09-22'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'Charlie',

    last_name: 'Black',

    date_of_birth: new Date('1975-12-05'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'Diana',

    last_name: 'Green',

    date_of_birth: new Date('2000-03-30'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    first_name: 'Eve',

    last_name: 'Gray',

    date_of_birth: new Date('1995-11-11'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const PrescriptionsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    issued_date: new Date('2023-10-01T10:00:00'),

    medication_details: 'Amoxicillin 500mg, 3 times a day',

    status: 'in-progress',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    issued_date: new Date('2023-10-02T11:30:00'),

    medication_details: 'Ibuprofen 200mg, as needed',

    status: 'in-progress',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    issued_date: new Date('2023-10-03T09:15:00'),

    medication_details: 'Metformin 500mg, twice a day',

    status: 'readyforpickup',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    issued_date: new Date('2023-10-04T14:45:00'),

    medication_details: 'Lisinopril 10mg, once a day',

    status: 'collected',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    issued_date: new Date('2023-10-05T16:00:00'),

    medication_details: 'Atorvastatin 20mg, once a day',

    status: 'in-progress',

    // type code here for "relation_one" field
  },
];

const OrganizationData = [
  {
    name: 'Nicolaus Copernicus',
  },

  {
    name: 'Neils Bohr',
  },

  {
    name: 'Carl Linnaeus',
  },

  {
    name: 'John Bardeen',
  },

  {
    name: 'Max Born',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User3 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (User3?.setOrganization) {
    await User3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const User4 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (User4?.setOrganization) {
    await User4.setOrganization(relatedOrganization4);
  }
}

async function associateAppointmentWithPatient() {
  const relatedPatient0 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setPatient) {
    await Appointment0.setPatient(relatedPatient0);
  }

  const relatedPatient1 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setPatient) {
    await Appointment1.setPatient(relatedPatient1);
  }

  const relatedPatient2 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setPatient) {
    await Appointment2.setPatient(relatedPatient2);
  }

  const relatedPatient3 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment3 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Appointment3?.setPatient) {
    await Appointment3.setPatient(relatedPatient3);
  }

  const relatedPatient4 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Appointment4 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Appointment4?.setPatient) {
    await Appointment4.setPatient(relatedPatient4);
  }
}

async function associateAppointmentWithDoctor() {
  const relatedDoctor0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setDoctor) {
    await Appointment0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setDoctor) {
    await Appointment1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setDoctor) {
    await Appointment2.setDoctor(relatedDoctor2);
  }

  const relatedDoctor3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Appointment3 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Appointment3?.setDoctor) {
    await Appointment3.setDoctor(relatedDoctor3);
  }

  const relatedDoctor4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Appointment4 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Appointment4?.setDoctor) {
    await Appointment4.setDoctor(relatedDoctor4);
  }
}

async function associateAppointmentWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Appointment0 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Appointment0?.setOrganization) {
    await Appointment0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Appointment1 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Appointment1?.setOrganization) {
    await Appointment1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Appointment2 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Appointment2?.setOrganization) {
    await Appointment2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Appointment3 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Appointment3?.setOrganization) {
    await Appointment3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Appointment4 = await Appointments.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Appointment4?.setOrganization) {
    await Appointment4.setOrganization(relatedOrganization4);
  }
}

async function associateInventoryWithPharmacy() {
  const relatedPharmacy0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory0 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Inventory0?.setPharmacy) {
    await Inventory0.setPharmacy(relatedPharmacy0);
  }

  const relatedPharmacy1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory1 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Inventory1?.setPharmacy) {
    await Inventory1.setPharmacy(relatedPharmacy1);
  }

  const relatedPharmacy2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory2 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Inventory2?.setPharmacy) {
    await Inventory2.setPharmacy(relatedPharmacy2);
  }

  const relatedPharmacy3 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory3 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Inventory3?.setPharmacy) {
    await Inventory3.setPharmacy(relatedPharmacy3);
  }

  const relatedPharmacy4 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Inventory4 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Inventory4?.setPharmacy) {
    await Inventory4.setPharmacy(relatedPharmacy4);
  }
}

async function associateInventoryWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Inventory0 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Inventory0?.setOrganization) {
    await Inventory0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Inventory1 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Inventory1?.setOrganization) {
    await Inventory1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Inventory2 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Inventory2?.setOrganization) {
    await Inventory2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Inventory3 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Inventory3?.setOrganization) {
    await Inventory3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Inventory4 = await Inventories.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Inventory4?.setOrganization) {
    await Inventory4.setOrganization(relatedOrganization4);
  }
}

// Similar logic for "relation_many"

async function associatePatientWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Patient0 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Patient0?.setUser) {
    await Patient0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Patient1 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Patient1?.setUser) {
    await Patient1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Patient2 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Patient2?.setUser) {
    await Patient2.setUser(relatedUser2);
  }

  const relatedUser3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Patient3 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Patient3?.setUser) {
    await Patient3.setUser(relatedUser3);
  }

  const relatedUser4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Patient4 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Patient4?.setUser) {
    await Patient4.setUser(relatedUser4);
  }
}

async function associatePatientWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Patient0 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Patient0?.setOrganization) {
    await Patient0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Patient1 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Patient1?.setOrganization) {
    await Patient1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Patient2 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Patient2?.setOrganization) {
    await Patient2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Patient3 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Patient3?.setOrganization) {
    await Patient3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Patient4 = await Patients.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Patient4?.setOrganization) {
    await Patient4.setOrganization(relatedOrganization4);
  }
}

async function associatePrescriptionWithPatient() {
  const relatedPatient0 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setPatient) {
    await Prescription0.setPatient(relatedPatient0);
  }

  const relatedPatient1 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setPatient) {
    await Prescription1.setPatient(relatedPatient1);
  }

  const relatedPatient2 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setPatient) {
    await Prescription2.setPatient(relatedPatient2);
  }

  const relatedPatient3 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription3 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Prescription3?.setPatient) {
    await Prescription3.setPatient(relatedPatient3);
  }

  const relatedPatient4 = await Patients.findOne({
    offset: Math.floor(Math.random() * (await Patients.count())),
  });
  const Prescription4 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Prescription4?.setPatient) {
    await Prescription4.setPatient(relatedPatient4);
  }
}

async function associatePrescriptionWithDoctor() {
  const relatedDoctor0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setDoctor) {
    await Prescription0.setDoctor(relatedDoctor0);
  }

  const relatedDoctor1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setDoctor) {
    await Prescription1.setDoctor(relatedDoctor1);
  }

  const relatedDoctor2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setDoctor) {
    await Prescription2.setDoctor(relatedDoctor2);
  }

  const relatedDoctor3 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Prescription3 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Prescription3?.setDoctor) {
    await Prescription3.setDoctor(relatedDoctor3);
  }

  const relatedDoctor4 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Prescription4 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Prescription4?.setDoctor) {
    await Prescription4.setDoctor(relatedDoctor4);
  }
}

async function associatePrescriptionWithOrganization() {
  const relatedOrganization0 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Prescription0 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Prescription0?.setOrganization) {
    await Prescription0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Prescription1 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Prescription1?.setOrganization) {
    await Prescription1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Prescription2 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Prescription2?.setOrganization) {
    await Prescription2.setOrganization(relatedOrganization2);
  }

  const relatedOrganization3 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Prescription3 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 3,
  });
  if (Prescription3?.setOrganization) {
    await Prescription3.setOrganization(relatedOrganization3);
  }

  const relatedOrganization4 = await Organization.findOne({
    offset: Math.floor(Math.random() * (await Organization.count())),
  });
  const Prescription4 = await Prescriptions.findOne({
    order: [['id', 'ASC']],
    offset: 4,
  });
  if (Prescription4?.setOrganization) {
    await Prescription4.setOrganization(relatedOrganization4);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Appointments.bulkCreate(AppointmentsData);

    await Inventories.bulkCreate(InventoriesData);

    await Organizations.bulkCreate(OrganizationsData);

    await Patients.bulkCreate(PatientsData);

    await Prescriptions.bulkCreate(PrescriptionsData);

    await Organization.bulkCreate(OrganizationData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateAppointmentWithPatient(),

      await associateAppointmentWithDoctor(),

      await associateAppointmentWithOrganization(),

      await associateInventoryWithPharmacy(),

      await associateInventoryWithOrganization(),

      // Similar logic for "relation_many"

      await associatePatientWithUser(),

      await associatePatientWithOrganization(),

      await associatePrescriptionWithPatient(),

      await associatePrescriptionWithDoctor(),

      await associatePrescriptionWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('appointments', null, {});

    await queryInterface.bulkDelete('inventories', null, {});

    await queryInterface.bulkDelete('organizations', null, {});

    await queryInterface.bulkDelete('patients', null, {});

    await queryInterface.bulkDelete('prescriptions', null, {});

    await queryInterface.bulkDelete('organization', null, {});
  },
};
