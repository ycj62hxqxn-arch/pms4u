# freeze.py
# Defines the constitutional freeze mechanism for mutation interception

class ConstitutionalFreeze(Exception):
    def __init__(self, freeze_record):
        self.freeze_record = freeze_record
        super().__init__("CONSTITUTIONAL FREEZE: Mutation blocked before consequence binding.")
