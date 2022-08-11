import { useEffect, useState } from "react"
import { coreApi } from "../../../app/core-api";
import SapIcon from "../../../components/SapIcon";

export default function CustomersPage() {
    const [hello, setHello] = useState<string>();
    useEffect(() => {
       coreApi.get<string>("helloworld/wiji")
            .then(data => {
                setHello(data);
            });
    }, []);

    return <div>
        Customers page! - {hello}
        <SapIcon icon='warning' />
    </div>
}