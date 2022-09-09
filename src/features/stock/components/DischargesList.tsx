import { useState } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppIcon from "../../../components/AppIcon";
import AppPaginator from "../../../components/AppPaginator";
import { changeDischargesFilter, dischargesFilterSelector, dischargesSelector, searchDischargesAsync } from "../stock-slice"
import DischargeDetailsForm from "./DischargeDetailsForm";

export default function DischargesList() {
    const dispatch = useAppDispatch();
    var discharges = useAppSelector(dischargesSelector);
    const filter = useAppSelector(dischargesFilterSelector);

    const [selectedDischargeId, setSelectedDischargeId] = useState<string>();

    const handlePageChange = (page: number) => {
        dispatch(changeDischargesFilter({ page }));
        dispatch(searchDischargesAsync({ ...filter, page }));
    }

    return <>
        <Table responsive>
            <thead>
                <tr>
                    <th>Discharge Date</th>                    
                    <th>Customer</th>
                    <th>Product</th>
                    <th>To Bond No.</th>
                    <th className="text-end">Quantity</th>
                    <td />
                </tr>
            </thead>
            <tbody>
                {discharges.items.map(val => (<tr key={val.id}>
                    <td>{dateHelpers.toShortDateStr(val.date)}</td>                    
                    <td>{val.customer}</td>
                    <td>{val.product}</td>
                    <td>{val.toBondNo}</td>
                    <td className="text-end">{val.quantity.toFixed(4)}</td>
                    <td className="text-end">
                        <AppIcon icon="eye"
                            mode="button"
                            title="View Order"
                            onClick={() => setSelectedDischargeId(val.id)} />
                    </td>
                </tr>))}
            </tbody>
        </Table>
        <AppPaginator
            page={filter.page}
            pageSize={filter.pageSize}
            onChange={handlePageChange}
            total={discharges.total} />
        <Modal isOpen={!!selectedDischargeId} size="xl" toggle={() => setSelectedDischargeId(undefined)} backdrop="static">
            <ModalHeader toggle={() => setSelectedDischargeId(undefined)}>
                Discharge Details
            </ModalHeader>
            <ModalBody>
                <DischargeDetailsForm dischargeId={selectedDischargeId} />
            </ModalBody>
        </Modal>
    </>
}