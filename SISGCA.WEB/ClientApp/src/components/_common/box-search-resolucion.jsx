import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { FecthResolucionesSitradoc, FecthNormaLegalPorNumero } from '../../api/common';
import IconButton from '@material-ui/core/IconButton';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import DataTable from './datatable';
import DrawerWraperBox from './drawer-wraper-box';

class BoxSearchResolucion extends Component {
    constructor(props) {
        super(props);
        this.state = { ...this.buildInitialState() };
    }

    buildInitialState() {
        return {
            pagination: { page: 1, pageSize: 5, total: 0, items: [] },
            loading: false,
            filters: {
                numero: ''
            },
            tableDef: {
                propertyKeyName: 'id',
                columns: [
                    {
                        label: 'Número',
                        propertyName: 'nro_resol'
                    },
                    {
                        label: 'Sumilla',
                        propertyName: 'sumilla'
                    },
                    {
                        label: 'Fecha',
                        propertyName: 'auditmod',
                        isDate: true
                    },
                    {
                        label: 'Acciones',
                        custom: true,
                        thStyle: {
                            textAlign: 'center'
                        },
                        tdStyle: {
                            textAlign: 'center'
                        },
                        render: (item, loading) => (
                            <div>
                                <IconButton
                                    title="Seleccionar"
                                    aria-label="Edit"
                                    onClick={this.onSelectItem(item)}
                                    disabled={loading}
                                >
                                    <ArrowForwardIcon />
                                </IconButton>
                            </div>
                        )
                    }
                ]
            }
        };
    }

    setLoading = bool => {
        this.setState({ loading: bool });
    };

    handleSearch = numero => {
        this.setState({ filters: { numero: numero } }, () => {
            const { pagination } = this.state;
            this.loadData(pagination.page, pagination.pageSize);
        });
    };

    onSelectItem = item => e => {
        this.props.onSelect(item);
        if (this.props.closeOnSelect) this.close();
    };

    close = () => {
        this.setState({ ...this.buildInitialState() });
        this.props.onClose();
    };

    loadData = (page, pageSize) => {
        this.setState({ loading: true });
        FecthResolucionesSitradoc(this.state.filters.numero, page, pageSize)
            .then(response => {
                this.setState({ pagination: response.data.pagination, loading: false });
            })
            .catch(err => {
                this.setState({ loading: false });
            });
    };
    
    render() {
        const { tableDef, loading, pagination} = this.state;
        const { open } = this.props;
        return (
            <DrawerWraperBox
                inputPlaceholder="Ingrese número"
                open={open}
                onClose={this.close}
                onSearch={this.handleSearch}
                loading={loading}
            >
                <DataTable
                    loading={loading}
                    pagination={pagination}
                    tableDef={tableDef}
                    onChangePage={page => {
                        this.loadData(page, pagination.pageSize);
                    }}
                    onChangePageSize={pageSize => {
                        this.loadData(1, pageSize);
                    }}
                />
            </DrawerWraperBox>
        );
    }
}

BoxSearchResolucion.defaultProps = {
    closeOnSelect: true
};

BoxSearchResolucion.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    closeOnSelect: PropTypes.bool
};

export default BoxSearchResolucion;
