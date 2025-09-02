const generateDoorBOQ = (req, res) => {
    try {
        const { solidDoors, netDoors } = req.body;

        // Validate input
        if (!Array.isArray(solidDoors) || !Array.isArray(netDoors)) {
            return res.status(400).json({ error: 'Invalid input: solidDoors and netDoors must be arrays' });
        }

        const solidBOQ = solidDoors.map(door => {
            const count = Number(door.count);
            if (count <= 0) return [];
            return [
                ['Hinges', 'Pieces', (4 * count).toString()],
                [door.lockType, 'Set', count.toString()],
                ['Deadbolt', 'Piece', count.toString()],
                ['Door Handle / Pull Handle', 'Piece', count.toString()],
                ['Latch / Catch', 'Piece', count.toString()],
                ['Tower Bolt / Aldrop', 'Piece', count.toString()],
                ['Spyhole / Peephole', 'Piece', count.toString()],
                ['Door Closer', 'Piece', count.toString()],
                ['Door Stopper', 'Piece', count.toString()],
            ];
        });

        const netBOQ = netDoors.map(door => {
            const count = Number(door.count);
            const height = Number(door.height);
            const width = Number(door.width);
            if (count <= 0 || height <= 0 || width <= 0) return [];
            const area = height * width;
            return [
                ['Aluminium / uPVC Net Frame', 'Running Ft', (2 * (height + width) * count).toFixed(0)],
                ['Fly Mesh', 'Sq Ft', (area * count).toFixed(0)],
                ['Magnetic / Velcro Strip', 'Running Ft', 'As required'],
                ['Net Door Hinges', 'Pieces', (3 * count).toString()],
                ['Net Door Handle', 'Piece', count.toString()],
                ['Hydraulic Door Closer', 'Piece', count.toString()],
                ['Latch / Lock for Net Door', 'Set', count.toString()],
            ];
        });

        res.json({ solid: solidBOQ, net: netBOQ });
    } catch (error) {
        console.error('Error generating BOQ:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export { generateDoorBOQ };