import { useRef, useState } from 'react';
import {
    BankOutlined,
    BuildOutlined,
    CarOutlined,
    MedicineBoxOutlined,
} from '@ant-design/icons';

export const useCatalog = () => {
    const scrollListRef = useRef(null);
    const [catalogState, setCatalogState] = useState({
        activeTab: 'tramites',
        selectedSector: null,
    });

    const mockProcedures = [
        {
            id: 1,
            tramiteServicio: 'Trámite digital',
            titulo: 'Solicitud de información',
            descripcion: 'Consulta requisitos, costos y pasos para iniciar una solicitud.',
            dependenciaNombre: 'Gobierno Digital',
            iniciarTramite: false,
        },
        {
            id: 2,
            tramiteServicio: 'Servicio en línea',
            titulo: 'Consulta de requisitos',
            descripcion: 'Revisa la documentación y condiciones necesarias antes de iniciar.',
            dependenciaNombre: 'Secretaría de Finanzas y Administración',
            iniciarTramite: false,
        },
        {
            id: 3,
            tramiteServicio: 'Atención ciudadana',
            titulo: 'Seguimiento de trámites',
            descripcion: 'Revisa el avance y estatus de tus solicitudes activas.',
            dependenciaNombre: 'Ventanilla Digital',
            iniciarTramite: false,
        },
    ];

    const sectoresData = [
        { idsector: 1, nombre: 'Gobierno' },
        { idsector: 2, nombre: 'Economía' },
        { idsector: 3, nombre: 'Salud' },
        { idsector: 4, nombre: 'Transporte' },
    ];

    const handleTabChange = (activeTab) => {
        setCatalogState((prev) => ({
            ...prev,
            activeTab,
            selectedSector: null,
        }));
    };

    const handleSectorClick = (selectedSector) => {
        setCatalogState((prev) => ({
            ...prev,
            selectedSector,
        }));
    };

    return {
        catalogState,
        handleTabChange,
        handleSectorClick,
        procedures: mockProcedures,
        serverTotal: mockProcedures.length,
        serverPage: 1,
        serverPageSize: 10,
        handleServerPageChange: () => {},
        scrollListRef,
        sectoresData,
        sectorIcons: {
            Gobierno: BankOutlined,
            Economía: BuildOutlined,
            Salud: MedicineBoxOutlined,
            Transporte: CarOutlined,
        },
        isLoading: false,
    };
};
