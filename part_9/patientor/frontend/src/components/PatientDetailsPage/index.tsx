import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import patientService from "../../services/patients";
import { Patient } from "../../types";
import { Male, Female, Transgender } from "@mui/icons-material";

const getGenderIcon = (gender: string) => {
  switch (gender) {
    case "male":
      return <Male color="primary" />;
    case "female":
      return <Female color="secondary" />;
    default:
      return <Transgender color="action" />;
  }
};

const PatientDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (id) {
      patientService.getById(id).then(setPatient);
    }
  }, [id]);

  if (!patient) return <div>Loading...</div>;

  return (
    <div>
      <h2>{patient.name} {getGenderIcon(patient.gender)}</h2>
      <div>SSN: {patient.ssn}</div>
      <div>Occupation: {patient.occupation}</div>
      <h3>Entries</h3>
      <ul>
        {patient.entries && patient.entries.length > 0 ? (
          patient.entries.map((entry) => (
            <li key={entry.id}>
              <div>
                <strong>{entry.date}</strong> - {entry.description}
              </div>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
                <ul>
                  {entry.diagnosisCodes.map((code) => (
                    <li key={code}>{code}</li>
                  ))}
                </ul>
              )}
            </li>
          ))
        ) : (
          <div>No entries found for this patient.</div>
        )}
      </ul>
    </div>
  );
};

export default PatientDetailsPage;