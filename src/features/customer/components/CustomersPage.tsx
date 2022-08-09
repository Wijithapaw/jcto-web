import { useEffect, useState } from "react"
import { coreApi } from "../../../app/core-api";

export default function CustomersPage() {
    const [hello, setHello] = useState<string>();
    useEffect(() => {
       coreApi.get<string>("helloworld")
            .then(data => {
                setHello(data);
            });
    }, []);

    return <div>
        Customers page! - {hello}
    </div>
}