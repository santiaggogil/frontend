import { Routes } from '@angular/router';

// Aquí podrías importar componentes si alguna ruta no fuera lazy-loaded,
// por ejemplo, el componente del Dashboard.
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';

export const AdminLayoutRoutes: Routes = [
    // Ruta principal del layout de administrador
    { path: 'dashboard',      component: DashboardComponent },

    // --- Aquí están todas las rutas que movimos ---
    {
        path: 'states',
        loadChildren: () => import('src/app/pages/states/states.module').then(m => m.StatesModule)
    },
    {
        path: 'specialties',
        loadChildren: () => import('src/app/pages/specialties/specialties.module').then(m => m.SpecialtiesModule)
    },
    {
        path: 'operators',
        loadChildren: () => import('src/app/pages/operators/operators.module').then(m => m.OperatorsModule)
    },
    {
        path: 'operatorSpecialties',
        loadChildren: () => import('src/app/pages/operator_specialties/operator-specialties.module').then(m => m.OperatorSpecialtiesModule)
    },
    {
        path: 'insurances',
        loadChildren: () => import('src/app/pages/insurances/insurances.module').then(m => m.insurancesModule)
    },
    {
        path: 'operatorPolicies',
        loadChildren: () => import('src/app/pages/operator-policies/operator-policies.module').then(m => m.OperatorPoliciesModule)
    },
    {
        path: 'machines',
        loadChildren: () => import('src/app/pages/machines/machines.module').then(m => m.MachinesModule)
    },
    {
        path: 'machinePolicies',
        loadChildren: () => import('src/app/pages/machine-policies/machine-policies.module').then(m => m.MachinePoliciesModule)
    },
    {
        path: 'serviceTypes',
        loadChildren: () => import('src/app/pages/service-types/service-types.module').then(m => m.ServiceTypesModule)
    },
    {
        path: 'specialtyTypes',
        loadChildren: () => import('src/app/pages/specialty-types/specialty-types.module').then(m => m.SpecialtyTypesModule)
    },
    {
        path: 'shifts',
        loadChildren: () => import('src/app/pages/shifts/shifts.module').then(m => m.ShiftsModule)
    },
    {
        path: 'news',
        loadChildren: () => import('src/app/pages/news/news.module').then(m => m.NewsModule)
    },
    {
        path: 'maintenances',
        loadChildren: () => import('src/app/pages/maintenances/maintenances.module').then(m => m.MaintenancesModule)
    },
    {
        path: 'procedures',
        loadChildren: () => import('src/app/pages/procedures/procedures.module').then(m => m.ProceduresModule)
    },
    {
        path: 'services',
        loadChildren: () => import('src/app/pages/services/services.module').then(m => m.ServicesModule)
    },
    {
        path: 'packages',
        loadChildren: () => import('src/app/pages/packages/packages.module').then(m => m.PackagesModule)
    },
    {
        path: 'reviews',
        loadChildren: () => import('src/app/pages/reviews/reviews.module').then(m => m.ReviewsModule)
    },
    {
        path: 'evidences',
        loadChildren: () => import('src/app/pages/evidences/evidences.module').then(m => m.EvidencesModule)
    },
    {
        path: 'bills',
        loadChildren: () => import('src/app/pages/bills/bills.module').then(m => m.BillsModule)
    },
    {
        path: 'quotas',
        loadChildren: () => import('src/app/pages/quotas/quotas.module').then(m => m.QuotasModule)
    },
    {
        path: 'towns',
        loadChildren: () => import('src/app/pages/towns/towns.module').then(m => m.TownsModule)
    },
    {
        path: 'projects',
        loadChildren: () => import('src/app/pages/projects/projects.module').then(m => m.ProjectsModule)
    },
    {
        path: 'project-town',
        loadChildren: () => import('src/app/pages/project-town/project-town.module').then(m => m.ProjectTownModule)
    },
    {
        path: 'governors',
        loadChildren: () => import('src/app/pages/governors/governors.module').then(m => m.GovernorsModule)
    },
    {
        path: 'mayors',
        loadChildren: () => import('src/app/pages/mayors/mayors.module').then(m => m.MayorsModule)
    },
    {
        path: 'mayor-town',
        loadChildren: () => import('src/app/pages/mayor-town/mayor-town.module').then(m => m.MayorTownModule)
    },
    {
        path: 'chats',
        loadChildren: () => import('src/app/pages/chats/chats.module').then(m => m.ChatsModule)
    },
    {
        path: 'messages',
        loadChildren: () => import('src/app/pages/messages/messages.module').then(m => m.MessagesModule)
    },
    {
        path: 'state-governor',
        loadChildren: () => import('src/app/pages/state-governor/state-governor.module').then(m => m.StateGovernorModule)
    },
    {
        path: 'gps',
        loadChildren: () => import('src/app/pages/gps/gps.module').then(m => m.GpsModule)
    },
    {
        path: 'maintenanceProcedures',
        loadChildren: () => import('src/app/pages/maintenance-procedures/maintenance-procedures.module').then(m => m.MaintenanceProceduresModule)
    }
];