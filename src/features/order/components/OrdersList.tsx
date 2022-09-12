import { useState } from "react";
import { Modal, ModalBody, ModalHeader, Table } from "reactstrap";
import { dateHelpers } from "../../../app/helpers";
import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import AppIcon from "../../../components/AppIcon";
import AppPaginator from "../../../components/AppPaginator";
import { changeOrderFilter, orderFilterSelector, ordersSelector, searchOrdersAsync } from "../order-slice"
import { BuyerType, OrderStatus } from "../types";
import OrderDetailsForm from "./OrderDetailsForm";

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
                    <td />
                </tr>
            </thead>
            <tbody>
                {orders.items.map(val => (<tr key={val.id}>
                    <td>{dateHelpers.toShortDateStr(val.orderDate)}</td>
                    <td>
                        <AppIcon
                            className={`${val.status === OrderStatus.Delivered ? 'text-success' : 'text-danger'} me-2`}
                            icon={val.status === OrderStatus.Delivered ? 'check' : 'x'}
                            title={val.status === OrderStatus.Delivered ? 'Delivered' : 'Undelivered'}
                        />
                        {val.orderNo}
                    </td>
                    <td>{val.customer}</td>
                    <td>{val.product}</td>
                    <td>
                        <AppIcon className="me-2"
                            title={`${val.buyerType === BuyerType.Barge ? 'Barge' : 'Bowser'}`}
                            icon={`${val.buyerType === BuyerType.Barge ? 'ship' : 'truck'}`} />
                        {val.buyer}</td>
                    <td className="text-end">{val.quantity.toFixed(4)}</td>
                    <td className="text-end">{val.deliveredQuantity?.toFixed(4)}</td>
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
                <OrderDetailsForm orderId={selectedOrderId} onUpdate={refreshList} />
            </ModalBody>
        </Modal>
    </>
}