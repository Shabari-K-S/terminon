export interface Profile {
    id: string;
    name: string;
    command: string;
    args?: string[];
    icon?: string; // Optional icon name (we can use Lucide names or generic types)
}
