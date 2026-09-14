import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { crudExampleApi } from "@/modules/crudExample/crudExampleApi";

const queryKey = ["crud-example", "users"];

export const useCrudExample = () => {
    const queryClient = useQueryClient();

    const usersQuery = useQuery({
        queryKey,
        queryFn: crudExampleApi.list,
    });

    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey });
    };

    const createMutation = useMutation({
        mutationFn: crudExampleApi.create,
        onSuccess: invalidateUsers,
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, values }) => crudExampleApi.update(id, values),
        onSuccess: invalidateUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: crudExampleApi.remove,
        onSuccess: invalidateUsers,
    });

    return {
        records: usersQuery.data?.data ?? [],
        total: usersQuery.data?.total ?? 0,
        isLoading: usersQuery.isLoading,
        isFetching: usersQuery.isFetching,
        isSaving: createMutation.isPending || updateMutation.isPending || deleteMutation.isPending,
        createRecord: createMutation.mutateAsync,
        updateRecord: updateMutation.mutateAsync,
        deleteRecord: deleteMutation.mutateAsync,
    };
};
