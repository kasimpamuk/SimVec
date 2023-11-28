Padding(
  padding: EdgeInsetsDirectional.fromSTEB(0, 0, 0, 16),
  child: Container(
    width: double.infinity,
    child: TextFormField(
      controller: _model.passwordController1,
      focusNode: _model.passwordFocusNode1,
      autofocus: true,
      autofillHints: [AutofillHints.password],
      obscureText: !_model.passwordVisibility1,
      decoration: InputDecoration(
        labelText: 'Password',
        labelStyle: FlutterFlowTheme.of(context).titleMedium.override(
              fontFamily: 'Plus Jakarta Sans',
              color: Color(0xFF57636C),
              fontSize: 18,
              fontWeight: FontWeight.w500,
            ),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Color(0xFFE0E3E7),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(40),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Color(0xFF4B39EF),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(40),
        ),
        errorBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Color(0xFFFF5963),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(40),
        ),
        focusedErrorBorder: OutlineInputBorder(
          borderSide: BorderSide(
            color: Color(0xFFFF5963),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(40),
        ),
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsetsDirectional.fromSTEB(24, 24, 24, 24),
        suffixIcon: InkWell(
          onTap: () => setState(
            () => _model.passwordVisibility1 = !_model.passwordVisibility1,
          ),
          focusNode: FocusNode(skipTraversal: true),
          child: Icon(
            _model.passwordVisibility1
                ? Icons.visibility_outlined
                : Icons.visibility_off_outlined,
            color: Color(0xFF57636C),
            size: 24,
          ),
        ),
      ),
      style: FlutterFlowTheme.of(context).titleMedium.override(
            fontFamily: 'Plus Jakarta Sans',
            color: Colors.white,
            fontSize: 18,
            fontWeight: FontWeight.w500,
          ),
      validator: _model.passwordController1Validator.asValidator(context),
    ),
  ),
)

