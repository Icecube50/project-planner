class AppConfig{

    getSprintColor(type){
        switch(type){
            case "KM ENG":
                return "Orange"
            case "KOS":
                return "Lime"
            case "Funktion":
                return "Yellow"
            case "I/O":
                return "Darkblue"
            case "Setup":
                return "Gainsboro"
            case "IBN":
                return "Aqua"
            case "I/O:OS":
                return "Grey"
            case "Setup:OS":
                return "Grey"
            case "IBN:OS":
                return "Grey"
        }
    }

    getEmployeeRoles(){
        return [
            'MES',
            'GUI',
            'KOS',
            'IBN',
            'ReSolve',
            'TL'
        ]
    }
}

export const Config = new AppConfig()