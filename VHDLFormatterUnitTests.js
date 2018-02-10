"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VHDLFormatter_1 = require("./VHDLFormatter");
const VHDLFormatter_2 = require("./VHDLFormatter");
const VHDLFormatter_3 = require("./VHDLFormatter");
const VHDLFormatter_4 = require("./VHDLFormatter");
const VHDLFormatter_5 = require("./VHDLFormatter");
const VHDLFormatter_6 = require("./VHDLFormatter");
const VHDLFormatter_7 = require("./VHDLFormatter");
let testCount = 0;
var showUnitTests = true; //window.location.href.indexOf("http") < 0;
if (showUnitTests) {
    testCount = 0;
    UnitTest();
    UnitTestIndentDecode();
    UnitTestRemoveAsserts();
    UnitTestApplyNoNewLineAfter();
    UnitTestSetNewLinesAfterSymbols();
    console.log("total tests: " + testCount);
}
function UnitTestSetNewLinesAfterSymbols() {
    console.log("=== SetNewLinesAfterSymbols ===");
    let input = "a; @@comments1\r\nb;";
    let expected = "a; @@comments1\r\nb;";
    let parameters = new VHDLFormatter_3.NewLineSettings();
    parameters.newLineAfter = ["then", ";"];
    parameters.noNewLineAfter = ["port", "generic"];
    UnitTest5(VHDLFormatter_7.SetNewLinesAfterSymbols, "no new line after comment", parameters, input, expected);
    input = "a; b;";
    expected = "a;\r\nb;";
    UnitTest5(VHDLFormatter_7.SetNewLinesAfterSymbols, "new line after ;", parameters, input, expected);
}
function UnitTestApplyNoNewLineAfter() {
    console.log("=== ApplyNoNewLineAfter ===");
    let input = ["a;", "b;"];
    let expected = ["a;@@singleline", "b;@@singleline"];
    let parameters = [";"];
    UnitTest4(VHDLFormatter_6.ApplyNoNewLineAfter, "one blankspace", parameters, input, expected);
    input = ["a;", "b THEN", "c"];
    expected = ["a;@@singleline", "b THEN@@singleline", "c"];
    parameters = [";", "then"];
    UnitTest4(VHDLFormatter_6.ApplyNoNewLineAfter, "one blankspace", parameters, input, expected);
}
function UnitTestRemoveAsserts() {
    console.log("=== RemoveAsserts ===");
    let input = ["ASSERT a;"];
    let expected = [""];
    UnitTest3(VHDLFormatter_5.RemoveAsserts, "one assert", input, expected);
    input = ["ASSERT a", "b;", "c"];
    expected = ["", "", "c"];
    UnitTest3(VHDLFormatter_5.RemoveAsserts, "multiline assert", input, expected);
}
function UnitTestIndentDecode() {
    console.log("=== IndentDecode ===");
    UnitTest2(VHDLFormatter_2.indentDecode, "one blankspace", " ", "one blankspace");
    UnitTest2(VHDLFormatter_2.indentDecode, "mixed chars", " A ", "one blankspace & one A & one blankspace");
    UnitTest2(VHDLFormatter_2.indentDecode, "4 blankspaces", "    ", "four blankspace");
    UnitTest2(VHDLFormatter_2.indentDecode, "9 blankspaces", "         ", "many blankspace");
}
function assert(testName, expected, actual, message) {
    var result = CompareString(actual, expected);
    if (result != true) {
        console.log(testName + " failed: " + result);
    }
    else {
        //console.log(testName + " pass");
    }
    testCount++;
}
function assertArray(testName, expected, actual, message) {
    var result = CompareArray(actual, expected);
    if (result != true) {
        console.log(testName + " failed: " + result);
    }
    else {
        //console.log(testName + " pass");
    }
    testCount++;
}
function UnitTest5(func, testName, parameters, inputs, expected) {
    let actual = func(inputs, parameters);
    assert(testName, expected, actual);
}
function UnitTest4(func, testName, parameters, inputs, expected) {
    let actual = JSON.parse(JSON.stringify(inputs));
    func(actual, parameters);
    assertArray(testName, expected, actual);
}
function UnitTest3(func, testName, inputs, expected) {
    let actual = JSON.parse(JSON.stringify(inputs));
    func(actual);
    assertArray(testName, expected, actual);
}
function UnitTest2(func, testName, inputs, expected) {
    let actual = func(inputs);
    assert(testName, expected, actual);
}
function deepCopy(objectToCopy) {
    return (JSON.parse(JSON.stringify(objectToCopy)));
}
function UnitTest() {
    let new_line_after_symbols = new VHDLFormatter_3.NewLineSettings();
    new_line_after_symbols.newLineAfter = ["then", ";"];
    new_line_after_symbols.noNewLineAfter = ["port", "generic"];
    let settings = new VHDLFormatter_4.BeautifierSettings(false, false, false, false, false, "uppercase", "    ", new_line_after_symbols);
    let input = "architecture TB of TB_CPU is\r\n    component CPU_IF\r\n    port   -- port list\r\n    end component;\r\n    signal CPU_DATA_VALID: std_ulogic;\r\n    signal CLK, RESET: std_ulogic := '0';\r\n    constant PERIOD : time := 10 ns;\r\n    constant MAX_SIM: time := 50 * PERIOD;\r\n    begin\r\n    -- concurrent statements\r\n    end TB;";
    let expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT -- port list\r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\n    -- concurrent statements\r\nEND TB;";
    let actual = VHDLFormatter_1.beautify(input, settings);
    assert("General", expected, actual);
    let newSettings = deepCopy(settings);
    newSettings.RemoveComments = true;
    expected = "ARCHITECTURE TB OF TB_CPU IS\r\n    COMPONENT CPU_IF\r\n        PORT \r\n    END COMPONENT;\r\n    SIGNAL CPU_DATA_VALID : std_ulogic;\r\n    SIGNAL CLK, RESET : std_ulogic := '0';\r\n    CONSTANT PERIOD : TIME := 10 ns;\r\n    CONSTANT MAX_SIM : TIME := 50 * PERIOD;\r\nBEGIN\r\nEND TB;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Remove comments", expected, actual);
    let new_line_after_symbols_2 = new VHDLFormatter_3.NewLineSettings();
    new_line_after_symbols_2.newLineAfter = [];
    new_line_after_symbols_2.noNewLineAfter = ["then", ";", "generic", "port"];
    newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    expected = "a; b; c;";
    input = "a; \r\nb;\r\n c;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Remove line after ;", expected, actual);
    newSettings = deepCopy(settings);
    newSettings.RemoveAsserts = true;
    input = "architecture arch of ent is\r\nbegin\r\n    assert False report sdfjcsdfcsdj;\r\n    assert False report sdfjcsdfcsdj severity note;\r\nend architecture;";
    expected = "ARCHITECTURE arch OF ent IS\r\nBEGIN\r\nEND ARCHITECTURE;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Remove asserts", expected, actual);
    input = "entity TB_DISPLAY is\r\n-- port declarations\r\nend TB_DISPLAY;\r\n\r\narchitecture TEST of TB_DISPLAY is\r\n-- signal declarations\r\nbegin\r\n-- component instance(s)\r\nend TEST;";
    expected = "ENTITY TB_DISPLAY IS\r\n    -- port declarations\r\nEND TB_DISPLAY;\r\n\r\nARCHITECTURE TEST OF TB_DISPLAY IS\r\n    -- signal declarations\r\nBEGIN\r\n    -- component instance(s)\r\nEND TEST;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("ENTITY ARCHITECTURE", expected, actual);
    newSettings = deepCopy(settings);
    newSettings.SignAlign = true;
    input = "port map(\r\ninput_1 => input_1_sig,\r\ninput_2 => input_2_sig,\r\noutput => output_sig\r\n);";
    expected = "PORT MAP(\r\n    input_1  => input_1_sig, \r\n    input_2  => input_2_sig, \r\n    output   => output_sig\r\n);";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Sign align in PORT", expected, actual);
    input = 'if a(3 downto 0) > "0100" then\r\na(3 downto 0) := a(3 downto 0) + "0011" ;\r\nend if ;';
    expected = 'IF a(3 DOWNTO 0) > "0100" THEN\r\n    a(3 DOWNTO 0) := a(3 DOWNTO 0) + "0011";\r\nEND IF;';
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("IF END IF case 1", expected, actual);
    input = "if s = '1' then\r\no <= \"010\";\r\nelse\r\no <= \"101\";\r\nend if;";
    expected = "IF s = '1' THEN\r\n    o <= \"010\";\r\nELSE\r\n    o <= \"101\";\r\nEND IF;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("IF ELSE END IF case 1", expected, actual);
    input = "IF (s = r) THEN rr := '0'; ELSE rr := '1'; END IF;";
    expected = "IF (s = r) THEN\r\n    rr := '0';\r\nELSE\r\n    rr := '1';\r\nEND IF;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("IF ELSE END IF case 2", expected, actual);
    input = 'P1:process\r\nvariable x: Integer range 1 to 3;\r\nvariable y: BIT_VECTOR (0 to 1);\r\nbegin\r\n  C1: case x is\r\n      when 1 => Out_1 <= 0;\r\n      when 2 => Out_1 <= 1;\r\n  end case C1;\r\n  C2: case y is\r\n      when "00" => Out_2 <= 0;\r\n      when "01" => Out_2 <= 1;\r\n  end case C2;\r\nend process;';
    expected = 'P1 : PROCESS\r\n    VARIABLE x : INTEGER RANGE 1 TO 3;\r\n    VARIABLE y : BIT_VECTOR (0 TO 1);\r\nBEGIN\r\n    C1 : CASE x IS\r\n        WHEN 1 => Out_1 <= 0;\r\n        WHEN 2 => Out_1 <= 1;\r\n    END CASE C1;\r\n    C2 : CASE y IS\r\n        WHEN "00" => Out_2 <= 0;\r\n        WHEN "01" => Out_2 <= 1;\r\n    END CASE C2;\r\nEND PROCESS;';
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("WHEN CASE", expected, actual);
    input = "case READ_CPU_STATE is\r\n  when WAITING =>\r\n    if CPU_DATA_VALID = '1' then\r\n      CPU_DATA_READ  <= '1';\r\n      READ_CPU_STATE <= DATA1;\r\n    end if;\r\n  when DATA1 =>\r\n    -- etc.\r\nend case;";
    expected = "CASE READ_CPU_STATE IS\r\n    WHEN WAITING => \r\n        IF CPU_DATA_VALID = '1' THEN\r\n            CPU_DATA_READ <= '1';\r\n            READ_CPU_STATE <= DATA1;\r\n        END IF;\r\n    WHEN DATA1 => \r\n        -- etc.\r\nEND CASE;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("WHEN CASE & IF", expected, actual);
    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\nEND;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("PORT MAP", expected, actual);
    input = "entity aa is\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\n    port (a : in std_logic;\r\n          b : in std_logic;\r\n         );\r\nend aa;\r\narchitecture bb of aa is\r\n   component cc\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    port(\r\n         a : in std_logic;\r\n         b : in std_logic;\r\n        );\r\n    end cc;\r\n\r\nbegin\r\n  C : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\n  D : cc port map (\r\n          long => a,\r\n          b => b\r\n        );\r\nend;";
    expected = "ENTITY aa IS\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\n    PORT (\r\n        a : IN std_logic;\r\n        b : IN std_logic;\r\n    );\r\nEND aa;\r\nARCHITECTURE bb OF aa IS\r\n    COMPONENT cc\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n        PORT (\r\n            a : IN std_logic;\r\n            b : IN std_logic;\r\n        );\r\n    END cc;\r\n\r\nBEGIN\r\n    C : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\n    D : cc\r\n    PORT MAP(\r\n        long => a, \r\n        b => b\r\n    );\r\nEND;";
    actual = VHDLFormatter_1.beautify(input, settings);
    assert("Multiple PORT MAPs", expected, actual);
    input = "port (a : in std_logic;\r\n b : in std_logic;\r\n);";
    expected = "PORT \r\n(\r\n    a : IN std_logic;\r\n    b : IN std_logic;\r\n);";
    new_line_after_symbols_2 = new VHDLFormatter_3.NewLineSettings();
    new_line_after_symbols_2.newLineAfter = ["then", ";", "generic", "port"];
    newSettings = deepCopy(settings);
    newSettings.NewLineSettings = new_line_after_symbols_2;
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("New line after PORT", expected, actual);
    input = "component a is\r\nport( Data : inout Std_Logic_Vector(7 downto 0););\r\nend component a;";
    expected = "COMPONENT a IS\r\n    PORT (Data : INOUT Std_Logic_Vector(7 DOWNTO 0););\r\nEND COMPONENT a;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("New line aster PORT (single line)", expected, actual);
    input = "process xyx (vf,fr,\r\nde -- comment\r\n)";
    expected = "PROCESS xyx (vf, fr, \r\n             de -- comment\r\n             )";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Align parameters in PROCESS", expected, actual);
    input = "architecture a of b is\r\nbegin\r\n    process (w)\r\n    variable t : std_logic_vector (4 downto 0) ;\r\nbegin\r\n    a := (others => '0') ;\r\nend process ;\r\nend a;";
    expected = "ARCHITECTURE a OF b IS\r\nBEGIN\r\n    PROCESS (w)\r\n    VARIABLE t : std_logic_vector (4 DOWNTO 0);\r\n    BEGIN\r\n        a := (OTHERS => '0');\r\n    END PROCESS;\r\nEND a;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Double BEGIN", expected, actual);
    let newSettings2 = deepCopy(newSettings);
    newSettings2.SignAlignAll = true;
    input = "entity a is\r\n    port ( w  : in  std_logic_vector (7 downto 0) ;\r\n           w_s : out std_logic_vector (3 downto 0) ; ) ;\r\nend a ;\r\narchitecture b of a is\r\nbegin\r\n    process ( w )\r\n    variable t : std_logic_vector (4 downto 0) ;\r\n    variable bcd     : std_logic_vector (11 downto 0) ;\r\nbegin\r\n    b(2 downto 0) := w(7 downto 5) ;\r\n    t         := w(4 downto 0) ;\r\n    w_s <= b(11 downto 8) ;\r\n    w <= b(3  downto 0) ;\r\nend process ;\r\nend b ;";
    expected = "ENTITY a IS\r\n    PORT \r\n    (\r\n        w   : IN std_logic_vector (7 DOWNTO 0);\r\n        w_s : OUT std_logic_vector (3 DOWNTO 0); \r\n    );\r\nEND a;\r\nARCHITECTURE b OF a IS\r\nBEGIN\r\n    PROCESS (w)\r\n    VARIABLE t   : std_logic_vector (4 DOWNTO 0);\r\n    VARIABLE bcd : std_logic_vector (11 DOWNTO 0);\r\n    BEGIN\r\n        b(2 DOWNTO 0) := w(7 DOWNTO 5);\r\n        t             := w(4 DOWNTO 0);\r\n        w_s <= b(11 DOWNTO 8);\r\n        w   <= b(3 DOWNTO 0);\r\n    END PROCESS;\r\nEND b;";
    actual = VHDLFormatter_1.beautify(input, newSettings2);
    assert("Align signs in all places", expected, actual);
    input = "begin\r\n  P0 : process(input)\r\n  variable value: Integer;\r\n  begin\r\n    result(i) := '0';\r\n  end process P0;\r\nend behavior;";
    expected = "BEGIN\r\n    P0 : PROCESS (input)\r\n        VARIABLE value : INTEGER;\r\n    BEGIN\r\n        result(i) := '0';\r\n    END PROCESS P0;\r\nEND behavior;";
    actual = VHDLFormatter_1.beautify(input, newSettings);
    assert("Indent after Begin", expected, actual);
}
function CompareString(actual, expected) {
    var l = Math.min(actual.length, expected.length);
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            var toEnd = Math.min(i + 50, l);
            return '\ndifferent at ' + i.toString() +
                '\nactual: "\n' + actual.substring(i, toEnd) +
                '\nexpected: "\n' + expected.substring(i, toEnd) + '"\n---' +
                "\nactual (full): \n" + actual + "\n---" +
                "\nexpected (full): \n" + expected + "\n====\n";
        }
    }
    if (actual != expected) {
        return 'actual: \n"' + actual + '"\nexpected: \n"' + expected + '"';
    }
    return true;
}
function CompareArray(actual, expected) {
    var l = Math.min(actual.length, expected.length);
    let result = "";
    for (var i = 0; i < l; i++) {
        if (actual[i] != expected[i]) {
            result += CompareString(actual[i], expected[i]) + "\n";
        }
    }
    if (actual.length > expected.length) {
        result += "actual has more items";
        for (var i = expected.length; i < actual.length; i++) {
            result += "actual[" + i + "] = " + actual[i];
        }
    }
    else if (actual.length < expected.length) {
        result += "expected has more items";
        for (var i = actual.length; i < expected.length; i++) {
            result += "expected[" + i + "] = " + expected[i];
        }
    }
    return true;
}
//# sourceMappingURL=VHDLFormatterUnitTests.js.map