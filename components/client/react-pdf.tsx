"use client"
import React, { useEffect, useState } from 'react';
import { Document, Page, Text, View, StyleSheet, Font, PDFViewer, BlobProvider } from '@react-pdf/renderer';
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link';
import { cn } from '../../lib/utils';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Checkbox } from '@/components/ui/checkbox';
import { useIsClient } from "@uidotdev/usehooks";
import { useLocalStorage } from "@uidotdev/usehooks";


// Importe uma fonte que deseja usar no PDF
// Font.register({ family: 'Arial', src: 'https://fonts.gstatic.com/s/arial/v15/tssv-0t9qAsmVcPqXSbI5jZ6MT4.woff2' });

Font.register({
    family: 'Open Sans',
    fonts: [
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
        { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 }
    ]
})

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontFamily: 'Open Sans',
        fontWeight: 10000000000000,
    },
    title: {
        fontSize: 16,

        marginBottom: 8,
        textAlign: 'center'
    },
    employerTable: {
        width: '100%',
        border: '1px solid #000',
        fontSize: 12,
        marginBottom: 10,
        lineHeight: 1.2
    },
    company: {
        width: '70%',
        padding: 2,
        fontWeight: 'bold',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000'
    },
    cnpj: {
        width: '30%',
        padding: 2,
        fontWeight: 'bold',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
    },
    employeeTable: {
        width: '100%',
        border: '1px solid #000',
        fontSize: 12,
        marginBottom: 10
    },
    employeeName: {
        width: '100%',
        padding: 2,
        fontWeight: 'bold',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000'
    },
    employeeOccupation: {
        width: '100%',
        padding: 2,
        fontWeight: 'bold',
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
    },
    table: {
        width: '100%',
        border: '1px solid #000',
        fontSize: 8,
    },
    row: {
        flexDirection: 'row',
    },
    day: {
        width: '4%',
        paddingTop: 4,
        paddingBottom: 4,
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        textAlign: 'center',
        lineHeight: 1.75
    },
    time: {
        width: '11%',
        fontSize: 9,
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        padding: 5,
        textAlign: 'center',
    },
    signature: {
        flexDirection: 'column-reverse',
        fontSize: 9,
        flex: 1,
        borderRight: '1px solid #000',
        borderBottom: '1px solid #000',
        padding: 5,
        textAlign: 'center',

    },
    headerCell: {
        backgroundColor: '#f0f0f0',
    },
});

const PontoPDF = ({ empregador, cnpj, funcionarios, mes }: { empregador: string, cnpj: string, funcionarios: string[], mes: Date }) => {
    const time = mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    const capitalized =
        time.charAt(0).toUpperCase()
        + time.slice(1)
    return (
        <Document>
            {funcionarios.map((funcionario, index) => (
                <Page key={index} size="A4" style={styles.page}>
                    <Text style={styles.title}>
                        Folha de Ponto - Período: {capitalized}
                    </Text>

                    <View style={styles.employerTable}>
                        <View style={styles.row}>
                            <Text style={styles.company}>Empregador(a): {empregador}</Text>
                            <Text style={styles.cnpj}>CNPJ: {cnpj}</Text>
                        </View>
                    </View>
                    <View style={styles.employeeTable}>
                        <View style={styles.row}>
                            <Text style={styles.employeeName}>Empregado(a): {funcionario}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.employeeOccupation}>Cargo: Cuidador de Idosos</Text>
                        </View>
                    </View>
                    <View style={styles.table}>
                        <View style={styles.row}>
                            <Text style={styles.day}>{"\n"}Dia</Text>
                            <Text style={styles.time}>{"\n"}Entrada</Text>
                            <Text style={styles.time}>Inter.{"\n"}(Almoço)</Text>
                            <Text style={styles.time}>Fim{"\n"}(Almoço)</Text>
                            <Text style={styles.time}>Inter.{"\n"}(Jantar)</Text>
                            <Text style={styles.time}>Fim{"\n"}(Jantar)</Text>
                            <Text style={styles.time}>{"\n"}Saída</Text>
                            <Text style={styles.signature}>Assinatura do Empregado{"\n"}(Rubrica)</Text>
                        </View>
                        {Array(31)
                            .fill(null)
                            .map((_, day) => (
                                <View key={day} style={styles.row}>
                                    <Text style={{ ...styles.day, lineHeight: 1.25 }}>{day + 1}</Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.time}></Text>
                                    <Text style={styles.signature}></Text>
                                </View>
                            ))}
                    </View>
                </Page>
            ))}
        </Document>
    );
};

export const App = () => {
    const isClient = useIsClient();
    const [inputedEmployeeName, setInputedEmployeeName] = useState('');
    const [inputedEmployerName, setInputedEmployerName] = useState('');
    const [inputedCNPJ, setInputedCNPJ] = useState('');
    const [employeeNameDatabase, setEmployeeNameDatabase] = useLocalStorage<string[]>("employeeNameDatabase", []);
    const [selectedEmployeeName, setSelectedEmployeeName] = useState<string[]>([])
    const [selectedMonth, setSelectedMonth] = useState('');
    const [inputedYear, setInputedYear] = useState(new Date().getFullYear().toString());
    const [selectAllChecked, setSelectAllChecked] = useState(false);
    const months = [
        'Janeiro',
        'Fevereiro',
        'Março',
        'Abril',
        'Maio',
        'Junho',
        'Julho',
        'Agosto',
        'Setembro',
        'Outubro',
        'Novembro',
        'Dezembro',
    ];

    const handleSelectAllChange = (checkState: boolean) => {
        if (checkState) {
            // Select All is checked, add all employees to the selectedEmployeeName array
            setSelectedEmployeeName([...employeeNameDatabase]);
        } else {
            // Select All is unchecked, clear the selectedEmployeeName array
            setSelectedEmployeeName([]);
        }
        setSelectAllChecked(checkState);
    };

    return (<div className="w-full flex flex-col gap-4 ">
        <Card>
            <CardHeader className='space-y-[0px]'>
                <CardTitle className='text-xl'>Formulário de cadastro de nome de funcionário</CardTitle>
                <CardDescription>digite o nome como ele deve aparecer no documento (folha de ponto)</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-2">
                <Input placeholder='Nome do funcionário' value={inputedEmployeeName} onChange={(e) => setInputedEmployeeName(e.target.value)} />
                <Button className='w-full' onClick={() => {
                    if (inputedEmployeeName != '' && isClient) {
                        const copy = [...employeeNameDatabase]
                        copy.push(inputedEmployeeName)
                        setEmployeeNameDatabase(copy)
                        setInputedEmployeeName('')
                    }
                }}>adicionar nome de funcionário ao banco de dados</Button>
            </CardContent>
        </Card>
        <hr />
        <Card>
            <CardHeader className='space-y-[0px]'>
                <CardTitle className='text-xl'>Configuração da folha de ponto</CardTitle>
                <CardDescription>escolha o nome do empregador e data (mês e ano do documento)</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-4">
                <div>
                    <Label>Empregador</Label>
                    <Input placeholder='Nome do Empregador' value={inputedEmployerName} onChange={(e) => setInputedEmployerName(e.target.value)} />
                    {inputedEmployerName == '' && <sub className='text-red-600 ml-2'>* Insira o nome do empregador</sub>}
                </div>
                <div>
                    <Label>Empregador</Label>
                    <Input placeholder='CNPJ do Empregador' value={inputedCNPJ} onChange={(e) => setInputedCNPJ(e.target.value)} />
                    {inputedCNPJ == '' && <sub className='text-red-600 ml-2'>* Insira o CNPJ do empregador</sub>}
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='flex flex-row gap-2'>
                        <div >
                            <Label>Mês</Label>
                            <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Mês" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map((month, index) => <><SelectItem value={index.toString()}>{month}</SelectItem></>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label>Ano</Label>
                            <Input value={inputedYear} onChange={(e) => setInputedYear(e.target.value)} className='w-[65px]' />
                        </div>
                    </div>
                    <div className='h-fit flex flex-row gap-2 text-[15px] mt-1 ml-2'>
                        {selectedMonth == '' && <sub className='text-red-600'>* Selecione o mês do documento</sub>}
                        {(selectedMonth == '' && inputedYear == '') && <sub className='text-red-600'>|</sub>}
                        {inputedYear == '' && <sub className='text-red-600'>* Insira o ano do documento</sub>}
                    </div>

                </div>
            </CardContent>
        </Card>
        <hr />
        <Card>
            <CardHeader className='space-y-[0px]'>
                <CardTitle className='text-xl'>Seleção de funcionários para gerar folha de ponto</CardTitle>
                <CardDescription>escolha apenas os funcionários que deseja adicionar no próximo documento (folha de ponto)</CardDescription>
            </CardHeader>
            <CardContent className='flex flex-col gap-1'>
                {isClient && employeeNameDatabase.map((item, index) => <div key={index}>
                    {index == 0 && <div className='flex flex-row gap-2 items-center mb-2'>
                        <Checkbox
                            value="Select All"
                            checked={selectAllChecked}
                            onCheckedChange={handleSelectAllChange}
                        />
                        <span className='w-full'>Selecionar todos</span>
                    </div>}
                    <hr className='mt-1' />
                    <div className='flex flex-row gap-2 items-center mt-1' >
                        <Checkbox value={item} checked={selectedEmployeeName.includes(item)} onCheckedChange={(checkState) => { checkState == true ? setSelectedEmployeeName([...selectedEmployeeName, item]) : setSelectedEmployeeName(selectedEmployeeName.filter(name => name != item)) }
                        } />
                        <span className='w-full'>{item}</span>
                        <Button className='w-fit whitespace-nowrap' onClick={() => {
                            setEmployeeNameDatabase([...employeeNameDatabase].filter(savedItem => savedItem != item))
                            setSelectedEmployeeName([...selectedEmployeeName].filter(selectedItem => selectedItem != item))
                        }}>excluir do banco de dados</Button>
                    </div>

                </div>
                )}
                {employeeNameDatabase.length == 0 && <sub className='text-red-600 mt-4'>* Insira ao menos 1 empregado na lista</sub>}
                {(selectedEmployeeName.length == 0 && employeeNameDatabase.length > 0) && <sub className='text-red-600 mt-4'>* Selecione ao menos 1 empregado</sub>}
            </CardContent>
        </Card>
        <hr />
        {isClient && <BlobProvider document={<PontoPDF cnpj={inputedCNPJ} empregador={inputedEmployerName} funcionarios={selectedEmployeeName} mes={new Date(Number(inputedYear), Number(selectedMonth))} />}>
            {({ blob, url, loading, error }) => {
                let result
                if (loading) result = '...carregando'
                if (error != null) result = 'error'
                if (url != null) result = <div className='w-full'>
                    <Button disabled={inputedCNPJ == '' || selectedEmployeeName.length == 0 || selectedMonth == '' || inputedYear == '' || inputedEmployerName == ''} className='w-full p-0'><Link className='w-full h-full flex flex-col items-center justify-center' href={url} target='_blank'>ver documento</Link></Button>
                    {(inputedCNPJ == '' || selectedEmployeeName.length == 0 || selectedMonth == '' || inputedYear == '' || inputedEmployerName == '' || employeeNameDatabase.length == 0) && <sub className='text-red-600 mt-4'>* você precisa preencher os dados antes de ver um documento</sub>}
                </div>
                return result
            }}
        </BlobProvider>}

    </div>
    );
};
