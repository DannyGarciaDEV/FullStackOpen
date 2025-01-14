import { useState } from "react";
import { Patient, Gender, Diagnosis, Entry, HealthCheckRating, EntryWithoutId } from "../../types";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Male';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import WorkIcon from '@mui/icons-material/Work';
import { Typography, Button } from "@mui/material";
import Box from '@mui/material/Box';
import patientService from "../../services/patients";
import axios from "axios";
import AddEntryModel from "../AddEntryModel";

interface Props {
    patient: Patient | null | undefined;
    diagnoses: Diagnosis[];
}

const GenderIcon: React.FC<{ gender: Gender | undefined }> = ({ gender }) => {
    if (gender === "female") return <FemaleIcon />;
    if (gender === "male") return <MaleIcon />;
    return null;
};

const HealthRating: React.FC<{ health: HealthCheckRating }> = ({ health }) => {
    switch (health) {
        case 0:
            return <FavoriteIcon sx={{ color: "green" }} />;
        case 1:
            return <FavoriteIcon sx={{ color: "yellow" }} />;
        case 2:
            return <FavoriteIcon sx={{ color: "blue" }} />;
        case 3:
            return <FavoriteIcon sx={{ color: "red" }} />;
        default:
            return null;
    }
};

const assertNever = (value: never): never => {
    throw new Error(
        `Unhandled discriminated union member: ${JSON.stringify(value)}`
    );
};

const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
        case "HealthCheck":
            return <HealthRating health={entry.healthCheckRating} />;
        case "Hospital":
            return (
                <div>
                    <p>Discharge date: {entry.discharge.date}</p>
                    <ul>
                        <li>Criteria: <i>{entry.discharge.criteria}</i></li>
                    </ul>
                </div>
            );
        case "OccupationalHealthcare":
            return entry.sickLeave ? (
                <p>SICK LEAVE: {entry.sickLeave.startDate} - {entry.sickLeave.endDate}</p>
            ) : null;
        default:
            return assertNever(entry);
    }
};

const OnePatientPage: React.FC<Props> = ({ patient, diagnoses }) => {
    const [currentPatient, setCurrentPatient] = useState<Patient | null | undefined>(patient);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [error, setError] = useState<string>();

    const openModal = (): void => setModalOpen(true);
    const closeModal = (): void => {
        setModalOpen(false);
        setError(undefined);
    };

    const handleAxiosError = (e: unknown) => {
        if (axios.isAxiosError(e)) {
            if (e?.response?.data && typeof e?.response?.data === "string") {
                const message = e.response.data.replace('Something went wrong. Error: ', '');
                console.error(message);
                setError(message);
            } else {
                setError("Unrecognized axios error");
            }
        } else {
            console.error("Unknown error", e);
            setError("Unknown error");
        }
    };

    const submitNewEntry = async (values: EntryWithoutId) => {
        try {
            if (currentPatient) {
                const entry = await patientService.addEntry(currentPatient.id, values);
                setCurrentPatient({
                    ...currentPatient,
                    entries: currentPatient.entries.concat(entry)
                });
                setModalOpen(false);
            }
        } catch (e) {
            handleAxiosError(e);
        }
    };

    return (
        <div>
            <Typography component="h5" variant="h5">{currentPatient?.name}<GenderIcon gender={currentPatient?.gender} /></Typography>
            <p>ssn: {currentPatient?.ssn}</p>
            <p>occupation: {currentPatient?.occupation}</p>
            <AddEntryModel
                onSubmit={submitNewEntry}
                error={error}
                onClose={closeModal}
                modalOpen={modalOpen}
            />
            <Button variant="contained" onClick={openModal}>
                Add New Entry
            </Button>
            <Typography component="h6" variant="h6">Entries</Typography>
            {currentPatient?.entries.map(e => (
                <Box key={e.id} sx={{ border: '1px solid grey', borderRadius: 4, padding: 2, marginBottom: 2 }}>
                    <p>{e.date}</p>
                    {e.type === "OccupationalHealthcare" ? (
                        e.employerName ? (
                            <p>
                                <WorkIcon /> {e.employerName}
                            </p>
                        ) : <WorkIcon />
                    ) : <MedicalServicesIcon />}
                    <p><i>{e.description}</i></p>
                    <ul>
                        {e.diagnosisCodes?.map(d => {
                            const diagnosis = diagnoses.find(diagnose => diagnose.code === d)?.name;
                            return (
                                <li key={d}>{d} {diagnosis ? diagnosis : null}</li>
                            );
                        })}
                    </ul>
                    <EntryDetails entry={e} />
                    <p>Diagnosed by {e.specialist}</p>
                </Box>
            ))}
        </div>
    );
};

export default OnePatientPage;
