import { Label } from "reactstrap";

interface Props {
    label: string;
    error?: string;
    touched?: boolean;
}

export default function FormLabel({ label, error, touched }: Props) {
    return <Label >
        {`${label}`}
        <i className={error && touched ? 'text-danger' : ''}>
            <small>
                {`${error && touched ? ' ' + error : ''}`}
            </small>
        </i>
    </Label>
}
