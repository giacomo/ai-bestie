export const tools = [{
    type: 'function',
    function: {
        name: 'getActualDate',
        description: 'Get the current date and time in ISO format',
    }
}];

function getActualDate(...args: unknown[]): string {
    return new Date().toISOString();
}

export const TOOL_MAPPING = {
    getActualDate
};
