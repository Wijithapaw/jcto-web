import { Label } from "reactstrap";

interface Props {
    label: string;
    error?: string;
    touched?: boolean;
}

export default function FormLabel({ label, error, touched }: Props) {
    return <Label className={error && touched ? 'text-danger' : ''}>
        {`${label}`}<i><small>{`${error && touched ? error : ''}`}</small></i>
    </Label>
}
