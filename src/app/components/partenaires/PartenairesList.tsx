"use client";

import {
    Button,
    Col,
    Flex,
    Input,
    Modal,
    Form,
    Pagination,
    Row,
    Spin,
    Table,
    message,
    Popconfirm,
    TableColumnType
} from "antd";
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import React, { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { PartenairesType } from "@/app/types/partenaires.type";
import { Paginate } from "@/app/interfaces/custom.interface";
import { AxiosError } from "axios";

export default function PartenairesList() {
    const columns: TableColumnType<PartenairesType>[] = [
        { title: 'Nom', dataIndex: 'nom', key: 'nom' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Téléphone', dataIndex: 'telephone', key: 'telephone' },
        { title: 'Adresse', dataIndex: 'adresse', key: 'adresse' },
        {
            title: 'Actions',
            key: 'actions',
            render: (_value: unknown, record: PartenairesType) => (
                <Flex gap={8}>
                    <Button color="cyan" variant="outlined" icon={<EditOutlined />} size="middle" onClick={() => showEditModal(record)}/>
                    <Popconfirm
                        title="Êtes-vous sûr de supprimer ce partenaire ?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Oui"
                        cancelText="Non"
                    >
                        <Button danger icon={<DeleteOutlined />} size="middle"></Button>
                    </Popconfirm>
                </Flex>
            )
        }
    ];

    const [partenaires, setPartenaires] = useState<PartenairesType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [limit, setLimit] = useState<number>(10);
    const [page, setPage] = useState<number>(1);
    const [totalRows, setTotalRows] = useState<number>(0);
    const [inputValue, setInputValue] = useState<string>('');
    const [searchValue, setSearchValue] = useState<string>('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPartenaire, setEditingPartenaire] = useState<PartenairesType | null>(null);
    const [form] = Form.useForm();

    //Refresh data function
    const refreshData = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data } = await api.get<Paginate<PartenairesType[]>>(
                `/partenaires?page=${page}&limit=${limit}&value=${searchValue}`
            );
            setPartenaires(data.data);
            setTotalRows(data.totalRows);
        } catch (err) {
            console.error(err);
            message.error("Erreur lors du chargement des partenaires");
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, searchValue]);

    // Fetch on mount / pagination / search
    useEffect(() => {
        refreshData().catch();
    }, [refreshData]);

    // Pagination
    const handlePaginationChange = (current: number, pageSize: number) => {
        if (pageSize !== limit) {
            setPage(1);
        } else {
            setPage(current);
        }
        setLimit(pageSize);
    };

    // Search
    const handleSearch = () => {
        setSearchValue(inputValue);
        setPage(1);
    };

    // Modal functions
    const showAddModal = () => {
        form.resetFields();
        setEditingPartenaire(null);
        setIsModalOpen(true);
    };

    const showEditModal = (record: PartenairesType) => {
        form.setFieldsValue(record);
        setEditingPartenaire(record);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setEditingPartenaire(null);
    };

    // Save / Update
    const handleSave = async () => {
        try {
            const values = await form.validateFields();
            if (editingPartenaire) {
                // Update
                await api.put(`/partenaires/${editingPartenaire.id}`, values);
                message.success("Partenaire mis à jour !");
            } else {
                // Add
                await api.post('/partenaires', values);
                message.success("Partenaire ajouté !");
            }
            handleCancel();
            await refreshData();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors de l'enregistrement");
        }
    };

    // Delete
    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/partenaires/${id}`);
            message.success("Partenaire supprimé !");
            // Si dernière page vide après suppression, revenir à page précédente
            if (partenaires.length === 1 && page > 1) setPage(page - 1);
            else await refreshData();
        } catch (err) {
            const error = err as AxiosError<{ message: string }>;
            console.error(error);
            message.error(error.response?.data?.message || "Erreur lors de la suppression");
        }
    };

    return (
        <>
            <Row className="mt-2" gutter={16}>
                <Col span={6}>
                    <Flex gap={4}>
                        <Input
                            placeholder="Rechercher"
                            value={inputValue}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
                        />
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch} />
                    </Flex>
                </Col>
                <Col span={6}>
                    <Button type="default" icon={<PlusOutlined />} onClick={showAddModal}>
                        Ajouter
                    </Button>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col span={24}>
                    <Spin description="Loading..." size="large" spinning={isLoading}>
                        <Table
                            columns={columns}
                            dataSource={partenaires}
                            pagination={false}
                            bordered
                            size="middle"
                            rowKey="id"
                            scroll={{ x: 1200, y: 500 }}
                            locale={{ emptyText: "Aucune donnée disponible" }}
                            style={{ marginTop: 10 }}
                        />
                    </Spin>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col span={24}>
                    <Pagination
                        current={page}
                        pageSize={limit}
                        total={totalRows}
                        showSizeChanger
                        onChange={handlePaginationChange}
                        onShowSizeChange={(_, pageSize) => handlePaginationChange(1, pageSize)}
                    />
                </Col>
            </Row>

            {/* Modal pour ajout / modification partenaire */}
            <Modal
                title={editingPartenaire ? "Modifier le partenaire" : "Ajouter un partenaire"}
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleSave}
                okText="Enregistrer"
                cancelText="Annuler"
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="nom" label="Nom" rules={[{ required: true, message: 'Veuillez entrer le nom' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: false, type: 'email', message: 'Email invalide' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="telephone" label="Téléphone" rules={[{ required: false, message: 'Veuillez entrer le téléphone' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="adresse" label="Adresse" rules={[{ required: false, message: 'Veuillez entrer l’adresse' }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}
