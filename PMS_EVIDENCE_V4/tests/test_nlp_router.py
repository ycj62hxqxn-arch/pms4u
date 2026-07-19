import pytest

from runtime.nlp_router import (
    NaturalLanguageRoutingError,
    translate_question,
)


def test_natural_language_why():
    result = translate_question(
        "Why is Execution Governance important?"
    )

    assert result["intent"] == "WHY"
    assert result["translated_query"] == "WHY EXECUTION_GOVERNANCE"
    assert result["translation_mode"] == "DETERMINISTIC_RULE"


def test_explain_concept():
    result = translate_question("Explain EGA")

    assert result["intent"] == "WHY"
    assert result["translated_query"] == "WHY EGA"


def test_trace_concept():
    result = translate_question("Trace PMS Govern")

    assert result["intent"] == "TRACE"
    assert result["translated_query"] == "TRACE PMS_GOVERN"


def test_compare_concepts():
    result = translate_question(
        "Compare PMS4U and GTCS4U"
    )

    assert result["intent"] == "COMPARE"

    assert set(result["concepts"]) == {
        "PMS4U",
        "GTCS4U",
    }

    assert result["translated_query"] in {
        "COMPARE PMS4U GTCS4U",
        "COMPARE GTCS4U PMS4U",
    }


def test_list_concepts():
    result = translate_question("Show all concepts")

    assert result["intent"] == "LIST"
    assert result["translated_query"] == "LIST CONCEPTS"


def test_direct_gql():
    result = translate_question(
        "WHY EXECUTION_GOVERNANCE"
    )

    assert result["translated_query"] == (
        "WHY EXECUTION_GOVERNANCE"
    )
    assert result["translation_mode"] == "DIRECT_GQL"


def test_empty_question_rejected():
    with pytest.raises(
        NaturalLanguageRoutingError
    ):
        translate_question("")


def test_unknown_question_rejected():
    with pytest.raises(
        NaturalLanguageRoutingError
    ):
        translate_question(
            "Tell me something completely unrelated"
        )
