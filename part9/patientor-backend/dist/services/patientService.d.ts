import { NonSensitivePatientListItem, NewPatient, Patient } from '../types';
declare const _default: {
    getNonSensitivePatients: () => NonSensitivePatientListItem[];
    addPatient: (newPatient: NewPatient) => Patient;
    getById: (id: string) => Patient | undefined;
};
export default _default;
