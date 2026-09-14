import { useState } from "react";
import { Button, Card, Form, Input, Popconfirm, Select, Space, Table, Tag, Typography, Modal, Pagination, ConfigProvider, Tooltip, Switch } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined, FrownOutlined } from "@ant-design/icons";
import { useCrudExample } from "@/modules/crudExample/useCrudExample";

const { Title, Text } = Typography;
const { Search } = Input;

const initialValues = {
    nombre: "",
    correo: "",
    estatus: "activo",
};

const CrudExampleView = () => {
    const [form] = Form.useForm();
    const [editingRecord, setEditingRecord] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchText, setSearchText] = useState("");
    const {
        records,
        total,
        isLoading,
        isSaving,
        createRecord,
        updateRecord,
        deleteRecord,
    } = useCrudExample();

    const resetForm = () => {
        setEditingRecord(null);
        setIsModalOpen(false);
        form.resetFields();
        form.setFieldsValue(initialValues);
    };

    const handleSubmit = async (values) => {
        if (editingRecord) {
            await updateRecord({ id: editingRecord.id, values });
        } else {
            await createRecord(values);
        }

        resetForm();
    };

    const handleEdit = (record) => {
        setEditingRecord(record);
        form.setFieldsValue(record);
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "nombre",
            key: "nombre",
        },
        {
            title: "Correo",
            dataIndex: "correo",
            key: "correo",
        },
        {
            title: "Estatus",
            dataIndex: "estatus",
            key: "estatus",
            render: (estatus) => (
                <Tag color={estatus === "activo" ? "green" : "default"}>
                    {estatus}
                </Tag>
            ),
        },
        {
            title: "Acciones",
            key: "acciones",
            fixed: "right",
            align: "center",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Editar">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            disabled={record.estatus !== "activo"}
                        />
                    </Tooltip>

                    <Popconfirm
                        title="¿Cambiar estado del registro?"
                        description={record.estatus === "activo" ? "El registro quedará inactivo" : "El registro quedará activo"}
                        okText="Sí"
                        cancelText="No"
                        onConfirm={() => updateRecord({ id: record.id, values: { ...record, estatus: record.estatus === "activo" ? "inactivo" : "activo" } })}
                        placement="top"
                    >   
                        <Tooltip title={record.estatus === "activo" ? "Desactivar" : "Activar"}>
                            <Switch
                                checked={record.estatus === "activo"}
                                onClick={(checked, e) => {
                                    e.preventDefault();
                                }}
                                size="small"
                                style={{ backgroundColor: record.estatus === "activo" ? "#10B981" : "#bfbfbf" }}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleSearchChange = (e) => {
        setSearchText(e.target.value);
        setCurrentPage(1);
    };

    const filteredRecords = records.filter(record => {
        if (!searchText || searchText.length < 4) return true;
        const lowerSearch = searchText.toLowerCase();
        return (
            (record.nombre && record.nombre.toLowerCase().includes(lowerSearch)) ||
            (record.correo && record.correo.toLowerCase().includes(lowerSearch)) ||
            (record.estatus && record.estatus.toLowerCase().includes(lowerSearch))
        );
    });

    const paginatedRecords = filteredRecords.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const handlePageChange = (page, size) => {
        const isSizeChange = Number(size) !== Number(pageSize);
        const targetPage = isSizeChange ? 1 : page;
        setCurrentPage(targetPage);
        setPageSize(size);
    };

    return (
        <div className="crud-example-view">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '5px', borderBottom: '2px solid #4A001F' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 600, margin: 0, color: '#4A001F' }}>Ejemplo</h2>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px', marginTop: '10px' }}>
                <div style={{ display: 'flex' }}>
                    <div style={{ minWidth: '150px', maxWidth: '250px', width: '100%' }}>
                        <Button type="primary" block icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#4D0621' }}>
                            Agregar Registro
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                <Tooltip title="Escribe al menos 4 caracteres">
                    <Search
                        placeholder="Buscar..."
                        allowClear
                        onChange={handleSearchChange}
                        style={{ width: '280px' }}
                    />
                </Tooltip>
            </div>

            <Modal
                title={editingRecord ? "Editar Registro" : "Nuevo Registro"}
                open={isModalOpen}
                onCancel={resetForm}
                footer={null}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={initialValues}
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Nombre"
                        name="nombre"
                        rules={[{ required: true, message: "Ingresa el nombre" }]}
                    >
                        <Input placeholder="Ingresa el nombre" />
                    </Form.Item>

                    <Form.Item
                        label="Correo"
                        name="correo"
                        rules={[
                            { required: true, message: "Ingresa el correo" },
                            { type: "email", message: "Ingresa un correo valido" },
                        ]}
                    >
                        <Input placeholder="ejemplo@correo.com" />
                    </Form.Item>

                    <Form.Item
                        label="Estatus"
                        name="estatus"
                        rules={[{ required: true, message: "Selecciona el estatus" }]}
                    >
                        <Select
                            placeholder="Selecciona un estatus"
                            options={[
                                { label: "Activo", value: "activo" },
                                { label: "Inactivo", value: "inactivo" },
                            ]}
                        />
                    </Form.Item>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '24px' }}>
                        <Button onClick={resetForm}>
                            Cancelar
                        </Button>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isSaving}
                        >
                            {editingRecord ? "Guardar cambios" : "Agregar"}
                        </Button>
                    </div>
                </Form>
            </Modal>

            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: "#4D0621",
                            headerColor: "#FFFFFF",
                        },
                    },
                }}
                renderEmpty={() => (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <FrownOutlined style={{ fontSize: 20, color: '#bfbfbf', marginBottom: '8px' }} />
                        <p style={{ color: '#bfbfbf', margin: 0 }}>No se encontró información</p>
                    </div>
                )}
            >
                <Table
                    rowKey="id"
                    columns={columns}
                    dataSource={paginatedRecords}
                    loading={isLoading}
                    pagination={false}
                    bordered
                />
            </ConfigProvider>
            
            <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredRecords.length}
                showSizeChanger
                onChange={handlePageChange}
                showTotal={(total) => `Total ${total} registros`}
                pageSizeOptions={[10, 20, 50, 100]}
                size="default"
                className="table-pagination"
                disabled={isLoading || filteredRecords.length === 0}
                locale={{ items_per_page: '/ página' }}
                style={{ marginTop: '16px', display: 'flex', justifyContent: 'center' }}
            />
        </div>
    );
};

export default CrudExampleView;
