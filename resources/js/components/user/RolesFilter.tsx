import { MultiSelect, MultiSelectContent, MultiSelectGroup, MultiSelectItem, MultiSelectTrigger } from '@/components/ui/multi-select';
import { Role } from '@/types/user';
import { PlusCircleIcon } from 'lucide-react';
import { useState } from 'react';
export default function RolesFilter({ roles, onChanges }: { roles: Role[]; onChanges: (values: string[]) => void }) {
    const [values, setValues] = useState<string[]>([]);

    return (
        <div>
            <MultiSelect
                defaultValues={values}
                onValuesChange={(values) => {
                    setValues(values);
                    onChanges(values);
                }}
            >
                <MultiSelectTrigger className="w-full">
                    <PlusCircleIcon />
                    <span className="border-r pr-2">Role</span>
                    <span className="text-muted-foreground">{`${values.length} selected`}</span>
                    {/* <MultiSelectValue placeholder="Select roles..." /> */}
                </MultiSelectTrigger>
                <MultiSelectContent>
                    <MultiSelectGroup>
                        {roles.map((role) => (
                            <MultiSelectItem key={role.id} value={role.id.toString()}>
                                {role.name}
                            </MultiSelectItem>
                        ))}
                    </MultiSelectGroup>
                </MultiSelectContent>
            </MultiSelect>
        </div>
    );
}
