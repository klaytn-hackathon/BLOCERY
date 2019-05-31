import React, { Component, PropTypes } from 'react';
import { getOrderByProducerNo } from '../../../lib/producerApi'
import ReactTable from "react-table"
import "react-table/react-table.css"
import ComUtil from '../../../util/ComUtil'
import { Button } from 'reactstrap'
import { ProducerFullModalPopupWithNav, Cell, BlocerySpinner } from '../../../components/common'
import Order from '../order'
import matchSorter from 'match-sorter'


export default class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: [],
            isOpen: false,
            orderNo: null
        }
    }
    componentDidMount(){
        this.search()
    }
    search = async () => {
        this.setState({loading: true})
        const { status, data } = await getOrderByProducerNo()
        if(status !== 200){
            alert('응답이 실패 하였습니다')
            return
        }
        this.setState({
            data: data,
            loading: false
        })
    }
    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }
    openOrderPopup = (orderNo) => {
        this.setState({
            orderNo: orderNo
        })
        this.toggle()
    }

    //저장 하였을 경우는 창을 닫지 않고, X 버튼을 눌렀을때만 닫도록 한다
    onClose = (isSaved) => {
        isSaved ? this.search() : this.toggle()
    }

    render() {

        if(this.state.data.length <= 0)
            return null

        return(
            <div>
                <ReactTable
                    data={this.state.data}
                    filterable
                    loading={this.state.loading}
                    loadingText={<BlocerySpinner/>}
                    showPagenation
                    onFetchData={(state, instance) => {
                        this.search()
                    }}
                    columns={[
                        {
                            Header: '주문번호',
                            // id: "orderNo",
                            accessor: 'orderNo',
                            Cell: props => <Cell textAlign='center'>{props.value}</Cell>,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true,
                            width: 80
                        },
                        {
                            Header: '상품명',
                            accessor: 'goodsNm',
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true
                        },
                        {
                            Header: '송장번호',
                            accessor: 'trackingNumber',
                            Cell: props => {
                                const { value, original } = props
                                return (
                                    <Button block color={value ? 'success' : 'warning'} onClick={this.openOrderPopup.bind(this, original.orderNo)}>{value || '입력' }</Button>
                                )
                            },
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true
                        },
                        {
                            Header: '일시',
                            //accessor 를 custom 하기 위해선 id 의 키가 필요
                            id: 'orderDate',
                            //accessor에서 편집된 값은 아래의 filterMethod의 rows 안에 들어있음
                            accessor: d => ComUtil.utcToString(d.orderDate),
                            Cell: props => <Cell textAlign='center'>{props.value}</Cell>,
                            filterMethod: (filter, rows) => {
                                //filter.value : 사용자가 입력한 값
                                //rows : 정의된 컬럼의 accessor 된 값이 있는 row object
                                return matchSorter(rows, filter.value, { keys: [filter.id] })
                            },
                            //filterMethod 를 사용하려면 필수
                            filterAll: true
                        },
                        {
                            Header: '주문자',
                            accessor: 'consumerNm',
                            Cell: props => <Cell textAlign='center'>{props.value}</Cell>,
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true

                        },
                        {
                            Header: '주문수량',
                            accessor: 'orderCnt',
                            Cell: props => <Cell textAlign='right'>{props.value}</Cell>
                        },
                        {
                            Header: '이메일',
                            accessor: 'consumerEmail',
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true
                        },
                        {
                            Header: '전화번호',
                            accessor: 'consumerPhone',
                            filterMethod: (filter, rows) => matchSorter(rows, filter.value, { keys: [filter.id] }),
                            filterAll: true
                        },
                    ]}
                    defaultPageSize={10}
                    className="-striped -highlight"
                />
                <ProducerFullModalPopupWithNav show={this.state.isOpen} title={'주문정보'} onClose={this.onClose}>
                    <Order orderNo={this.state.orderNo}/>
                </ProducerFullModalPopupWithNav>
            </div>
        );
    }
}