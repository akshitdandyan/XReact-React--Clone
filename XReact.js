let globalID = 0;
let globalParent;
const componentState = new Map();

export function useState( initialState ) {
    const childID = globalID;
    globalID++;
    const parent = globalParent;

    return (() => {
        const { cache } = componentState.get( parent );

        if( cache[ childID ] == null ) cache[ childID ] = { value: typeof initialState === 'function' ? initialState() : initialState }
    
        const setState = state => {
            const { props, component } = componentState.get( parent );
            if ( typeof state === 'function') cache[ childID ].value = state( cache[childID].value );
            else cache[ childID ].value = state;
    
            render(component, props, parent)
        }
    
        return [ cache[ childID ].value, setState ];
    })()

}

export function useEffect( callback, dependencies ) {
    const childID = globalID;
    globalID++;
    const parent = globalParent;

    (() => {
        const { cache } = componentState.get( parent );

        if( cache[ childID ] == null ) cache[ childID ] = { dependencies: undefined }
    
        const dependenciesChanged = dependencies == null || dependencies.some ((dep, i ) => cache[ childID ].dependencies == null || cache[ childID ].dependencies[i] !== dep)
    
        if( dependenciesChanged ){
            if( cache[ childID ].cleanup != null ) cache[ childID ].cleanup();
            cache[ childID ].cleanup = callback();
            cache[ childID ].dependencies = dependencies;
        }

    })()
}

export function useMemo( callback, dependencies ) {
    const childID = globalID;
    globalID++;
    const parent = globalParent;

    return(() => {
        const { cache } = componentState.get( parent );

        if( cache[ childID ] == null ) cache[ childID ] = { dependencies: undefined }
    
        const dependenciesChanged = dependencies == null || dependencies.some ((dep, i ) => cache[ childID ].dependencies == null || cache[ childID ].dependencies[i] !== dep)
    
        if( dependenciesChanged ){
            cache[ childID ].value = callback();
            cache[ childID ].dependencies = dependencies;
        }

        return cache[ childID ].value;

    })()
}

export function render(component, props, parent) { 
    const state = componentState.get( parent ) || { cache: [] };
    componentState.set( parent, { ...state, component, props });

    globalParent = parent;
    const output = component( props );
    globalID = 0;
    parent.textContent = output;
}