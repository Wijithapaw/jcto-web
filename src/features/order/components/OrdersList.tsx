import { useState } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { dateHelpers, numbersHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppIcon from "../../../components/AppIcon";
import AppPaginator from "../../../components/AppPaginator";
import { changeOrderFilter, orderFilterSelector, ordersSelector, searchOrdersAsync } from "../order-slice"
import { BuyerType, OrderStatus } from "../types";
import OrderDetailsForm from "./OrderDetailsForm";
import OrderStatusIcon from "./OrderStatusIcon";

export default function OrdersList() {
    const dispatch = useAppDispatch();
    var orders = useAppSelector(ordersSelector);
    const filter = useAppSelector(orderFilterSelector);

    const [selectedOrderId, setSelectedOrderId] = useState<string>();

    const handlePageChange = (page: number) => {
        dispatch(changeOrderFilter({ page }));
        dispatch(searchOrdersAsync({ ...filter, page }));
    }

    const refreshList = () => {
        dispatch(searchOrdersAsync(filter));
    }

    return <>
        <Table responsive>
            <thead>
                <tr>
                    <th>Order Date</th>
                    <th>Order No.</th>
                    <th>Customer</th>
                    <th>Product</th>
                    <th>Buyer</th>
                    <th className="text-end">Qty</th>
                    <th className="text-end">Del. Qty</th>
                    <th className="text-center">Issue Commenced</th>
                    <th className="text-center">Issue Completed</th>
                    <th></th>
                    <td />
                </tr>
            </thead>
            <tbody>
                {orders.items.map(val => (<tr key={val.id}>
                    <td>{dateHelpers.toShortDateStr(val.orderDate)}</td>
                    <td>
                        <OrderStatusIcon status={val.status} />
                        {val.orderNo}
                    </td>
                    <td>{val.customer}</td>
                    <td>{val.product}</td>
                    <td>
                        <AppIcon className="me-2"
                            title={`${val.buyerType === BuyerType.Barge ? 'Barge' : 'Bowser'}`}
                            icon={`${val.buyerType === BuyerType.Barge ? 'ship' : 'truck'}`} />
                        {val.buyer}</td>
                    <td className="text-end">{numbersHelpers.toDisplayStr(val.quantity)}</td>
                    <td className="text-end">{val.deliveredQuantity && numbersHelpers.toDisplayStr(val.deliveredQuantity)}</td>
                    <td className="text-center">{val.issueStartTime && dateHelpers.toDatetimeStr(val.issueStartTime)}</td>
                    <td className="text-center">{val.issueEndTime && dateHelpers.toDatetimeStr(val.issueEndTime)}</td>
                    <td className="text-end">
                        <AppIcon icon="eye"
                            mode="button"
                            title="View Order"
                            onClick={() => setSelectedOrderId(val.id)} />
                    </td>
                </tr>))}
            </tbody>
        </Table>
        <AppPaginator
            page={filter.page}
            pageSize={filter.pageSize}
            onChange={handlePageChange}
            total={orders.total} />
        <Modal isOpen={!!selectedOrderId} size="xl" toggle={() => setSelectedOrderId(undefined)} backdrop="static">
            <ModalHeader toggle={() => setSelectedOrderId(undefined)}>
                Order Details
            </ModalHeader>
            <ModalBody>
                <OrderDetailsForm orderId={selectedOrderId} onUpdate={refreshList}
                    onDelete={() => {
                        refreshList();
                        setSelectedOrderId(undefined);
                    }} />
            </ModalBody>
        </Modal>
    </>
}