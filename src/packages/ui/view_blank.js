export default `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <title>Документ</title>
    <style>

        html {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: auto;

        }
        body {
            width: 210mm;
            margin-left: auto;
            margin-right: auto;
            overflow: hidden;
            color: rgb(48, 57, 66);
            font-family: Arial, sans-serif;
            font-size: 11pt;
            text-rendering: optimizeLegibility;
        }

        /* Таблица */
        table.border {
            border-collapse: collapse; border: 1px solid;
        }
        table.border > tbody > tr > td,
        table.border > tr > td,
        table.border th{
            border: 1px solid;
        }
        .noborder{
            border: none;
        }

        /* Многоуровневый список */
        ol {
            counter-reset: li;
            list-style: none;
            padding: 0;
        }
        li {
            margin-top: 8px;
        }
        li:before {
            counter-increment: li;
            content: counters(li,".") ".";
            padding-right: 8px;
        }
        li.flex {
            display: flex;
            text-align: left;
            list-style-position: outside;
            font-weight: normal;
        }

        .container {
            width: 100%;
            position: relative;
        }

        .margin-top-20 {
            margin-top: 20px;
        }

        .column-50-percent {
            width: 48%;
            min-width: 40%;
            float: left;
            padding: 8px;
        }

        .column-30-percent {
            width: 31%;
            min-width: 30%;
            float: left;
            padding: 8px;
        }

        .block-left {
            display: block;
            float: left;
        }

        .block-center {
            display: block;
            margin-left: auto;
            margin-right: auto;
        }

        .block-right {
            display: block;
            float: right;
        }

        .list-center {
            text-align: center;
            list-style-position: inside;
            font-weight: bold;
        }

        .clear-both {
            clear: both;
        }

        .small {
            font-size: small;
        }

        .text-center {
            text-align: center;
        }

        .text-justify {
            text-align: justify;
        }

        .text-right {
            text-align: right;
        }

        .muted-color {
            color: #636773;
        }

        .accent-color {
            color: #f30000;
        }

        .note {
            background: #eaf3f8;
            color: #2980b9;
            font-style: italic;
            padding: 12px 20px;
        }

        .note:before {
            content: 'Замечание: ';
            font-weight: 500;
        }
        *, *:before, *:after {
            box-sizing: inherit;
        }

    </style>
</head>
<body>

</body>
</html>`;
