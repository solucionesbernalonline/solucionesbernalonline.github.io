((d) => {
    const $form = d.querySelector(".contact-form"),
          $loader = d.querySelector(".contact-form-loader"),
          $modal = d.getElementById("gracias"),
          $phone = d.getElementById("phone"),
          $comments = d.getElementById("comments"),
          $charCount = d.getElementById("charCount"),
          $name = d.getElementById('name');

    // Web3Forms API Key
    const WEB3FORMS_KEY = '6d98c86f-69cc-4725-9b3b-50a70d896339';

    // Ocultar loader inicialmente
    if ($loader) $loader.classList.add("none");

    // Validación en tiempo real para el campo nombre
    if ($name) {
        $name.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // Eliminar cualquier carácter que no sea letra o espacio
            value = value.replace(/[^A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]/g, '');
            
            // Reemplazar múltiples espacios consecutivos por un solo espacio
            value = value.replace(/\s+/g, ' ');
            
            // Eliminar espacios al inicio
            value = value.replace(/^\s+/, '');
            
            // Limitar a 40 caracteres
            if (value.length > 40) {
                value = value.substring(0, 40);
            }
            
            e.target.value = value;
        });

        // Validación al perder el foco - eliminar espacio final
        $name.addEventListener('blur', function(e) {
            let value = e.target.value;
            value = value.replace(/\s+$/, '');
            e.target.value = value;
        });

        // Prevenir que se pegue texto con espacios al inicio
        $name.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value;
                value = value.replace(/[^A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]/g, '');
                value = value.replace(/\s+/g, ' ');
                value = value.replace(/^\s+/, '');
                if (value.length > 40) {
                    value = value.substring(0, 40);
                }
                e.target.value = value;
            }, 0);
        });
    }

    // Formateador automático de teléfono
    if ($phone) {
        $phone.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Solo números
            
            // Limitar a 10 caracteres (2 código área + 8 número)
            if (value.length > 10) {
                value = value.substring(0, 10);
            }
            
            // Aplicar formato: 11 5 724-9156
            let formattedValue = value;
            
            if (value.length > 2) {
                formattedValue = value.substring(0, 2) + ' ' + value.substring(2);
            }
            
            if (value.length > 3) {
                formattedValue = value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + value.substring(3);
            }
            
            if (value.length > 6) {
                formattedValue = value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + value.substring(3, 6) + '-' + value.substring(6);
            }
            
            e.target.value = formattedValue;
        });

        // Prevenir que se peguen caracteres no numéricos
        $phone.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length > 10) {
                    value = value.substring(0, 10);
                }
                
                // Aplicar formato automáticamente al pegar
                let formattedValue = value;
                if (value.length > 2) {
                    formattedValue = value.substring(0, 2) + ' ' + value.substring(2);
                }
                if (value.length > 3) {
                    formattedValue = value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + value.substring(3);
                }
                if (value.length > 6) {
                    formattedValue = value.substring(0, 2) + ' ' + value.substring(2, 3) + ' ' + value.substring(3, 6) + '-' + value.substring(6);
                }
                
                e.target.value = formattedValue;
            }, 0);
        });

        // Eliminar espacios al inicio si los hubiera
        $phone.addEventListener('keydown', function(e) {
            if (e.target.value === '' && e.key === ' ') {
                e.preventDefault();
            }
        });
    }

    // Contador de caracteres para el textarea
    if ($comments && $charCount) {
        $comments.addEventListener('input', function() {
            $charCount.textContent = this.value.length;
            
            if (this.value.length > 200) {
                $charCount.style.color = '#ff4000';
            } else if (this.value.length > 150) {
                $charCount.style.color = '#ffa500';
            } else {
                $charCount.style.color = '#fff';
            }
        });
    }

    
    // Función para detectar y limpiar código malicioso en tiempo real
    function secureTextareaInput(textarea) {
        if (!textarea) return;
        
        // Validación en tiempo real - bloquea caracteres peligrosos
        textarea.addEventListener('input', function(e) {
            let value = e.target.value;
            
            // 🔥 LISTA NEGRA - Caracteres peligrosos para XSS
            const dangerousChars = /[<>{}[\]\\|^`]/g;
            const cleanedValue = value.replace(dangerousChars, '');
            
            // Solo actualizar si hubo cambios (para no interferir con el cursor)
            if (cleanedValue !== value) {
                const cursorPosition = e.target.selectionStart;
                e.target.value = cleanedValue;
                e.target.setSelectionRange(cursorPosition - 1, cursorPosition - 1);
                
                // Mostrar advertencia visual breve
                showSecurityWarning();
            }
        });
        
        // Prevenir pegado de código malicioso
        textarea.addEventListener('paste', function(e) {
            setTimeout(() => {
                let value = e.target.value;
                const dangerousChars = /[<>{}[\]\\|^`]/g;
                const cleanedValue = value.replace(dangerousChars, '');
                
                if (cleanedValue !== value) {
                    e.target.value = cleanedValue;
                    showSecurityWarning();
                }
            }, 0);
        });
        
        // Prevenir drag & drop de contenido malicioso
        textarea.addEventListener('drop', function(e) {
            e.preventDefault();
            showSecurityWarning('No se permite arrastrar y soltar archivos');
        });
    }
    
    // 🔥 FUNCIÓN MODIFICADA - Cartel centrado en parte superior
    function showSecurityWarning(message = 'Se removieron caracteres no permitidos') {
        // Crear elemento de advertencia temporal
        const warningDiv = document.createElement('div');
        warningDiv.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: #ff4000;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(255, 64, 0, 0.3);
            border: 1px solid #ff6a33;
            text-align: center;
            min-width: 300px;
            max-width: 90%;
            animation: slideDown 0.3s ease-out;
        `;
        warningDiv.textContent = message;
        document.body.appendChild(warningDiv);
        
        // Agregar animación CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }
            
            @keyframes fadeOut {
                from {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
            }
        `;
        document.head.appendChild(style);
        
        // Remover después de 3 segundos con animación de salida
        setTimeout(() => {
            if (warningDiv.parentNode) {
                warningDiv.style.animation = 'fadeOut 0.3s ease-in forwards';
                setTimeout(() => {
                    if (warningDiv.parentNode) {
                        warningDiv.parentNode.removeChild(warningDiv);
                    }
                    if (style.parentNode) {
                        style.parentNode.removeChild(style);
                    }
                }, 300);
            }
        }, 3000);
    }
    
    // Función mejorada de sanitización para el envío
    function enhancedSanitizeMessage(message) {
        if (!message) return '';
        
        // 1. Escapar caracteres HTML peligrosos
        let safeMessage = message
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#x27;')
            .replace(/\//g, '&#x2F;');
        
        // 2. Remover patrones de scripts y eventos
        const maliciousPatterns = [
            /javascript:/gi,
            /vbscript:/gi,
            /on\w+\s*=/gi,
            /expression\s*\(/gi,
            /eval\s*\(/gi
        ];
        
        maliciousPatterns.forEach(pattern => {
            safeMessage = safeMessage.replace(pattern, '[removed]');
        });
        
        // 3. Limitar longitud
        return safeMessage.substring(0, 255);
    }
    
    // Función de validación de seguridad antes del envío
    function validateMessageSecurity(message) {
        if (!message) return true;
        
        const securityPatterns = [
            /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, // Script tags
            /javascript:/gi, // JavaScript protocol
            /vbscript:/gi, // VBScript protocol
            /on\w+\s*=/gi, // Event handlers
            /expression\s*\(/gi, // CSS expressions
            /eval\s*\(/gi // eval function
        ];
        
        for (let pattern of securityPatterns) {
            if (pattern.test(message)) {
                return false;
            }
        }
        
        return true;
    }
    
    // Aplicar seguridad al textarea
    secureTextareaInput($comments);
    

    // Validación personalizada del nombre
    function validateName(name) {
        // Verificar que no esté vacío
        if (!name.trim()) {
            return false;
        }

        // Verificar longitud máxima
        if (name.length > 40) {
            return false;
        }

        // VERIFICACIÓN ESTRICTA:
        const nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü]+(?: [A-Za-zÑñÁáÉéÍíÓóÚúÜü]+)*$/;
        
        return nameRegex.test(name);
    }

    // Validación personalizada del teléfono - NUEVA VERSIÓN
    function validatePhone(phone) {
        const phoneRegex = /^\d{2}\s\d\s\d{3}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    // Función para mostrar mensajes de error específicos del nombre
    function showNameError() {
        const name = $name.value;
        
        if (!name.trim()) {
            return 'Por favor, ingresa tu nombre';
        }
        
        if (name.length > 40) {
            return 'El nombre no puede tener más de 40 caracteres';
        }
        
        if (/^\s/.test(name)) {
            return 'El nombre no puede comenzar con espacio';
        }
        
        if (/\s$/.test(name)) {
            return 'El nombre no puede terminar con espacio';
        }
        
        if (/\s\s/.test(name)) {
            return 'No puede haber espacios consecutivos. Solo un espacio entre palabras';
        }
        
        if (/[^A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]/.test(name)) {
            return 'Solo se permiten letras. No se permiten números ni caracteres especiales';
        }
        
        if (!/^[A-Za-zÑñÁáÉéÍíÓóÚúÜü]+(?: [A-Za-zÑñÁáÉéÍíÓóÚúÜü]+)*$/.test(name)) {
            return 'Formato inválido. Use solo letras y un espacio entre palabras';
        }
        
        return 'Nombre inválido';
    }

    // Función para mostrar mensajes de error del teléfono
    function showPhoneError() {
        const phone = $phone.value;
        
        if (!phone.trim()) {
            return 'Por favor, ingresa tu teléfono';
        }
        
        if (!/^\d{2}\s\d\s\d{3}-\d{4}$/.test(phone)) {
            return 'Formato inválido. Use el formato: 11 5 724-9156';
        }
        
        return 'Teléfono inválido';
    }

    $form.addEventListener("submit", e => {
        e.preventDefault();
        
        // Validaciones manuales
        const name = $name.value;
        const phone = $phone.value;
        const comments = d.getElementById('comments').value;

        // Validar nombre
        if (!validateName(name)) {
            const errorMessage = showNameError();
            alert(errorMessage);
            $name.focus();
            $name.select();
            return;
        }

        // Validar teléfono
        if (!validatePhone(phone)) {
            const errorMessage = showPhoneError();
            alert(errorMessage);
            $phone.focus();
            $phone.select();
            return;
        }

        // Validar mensaje
        if (comments.trim().length === 0) {
            alert('Por favor, ingresa un mensaje');
            d.getElementById('comments').focus();
            return;
        }

        if (comments.length > 255) {
            alert('El mensaje no puede superar los 255 caracteres');
            d.getElementById('comments').focus();
            return;
        }

        // VALIDACIÓN DE SEGURIDAD ANTES DE ENVIAR
        if (!validateMessageSecurity(comments)) {
            alert('El mensaje contiene código no permitido. Por favor, elimine cualquier script o código.');
            $comments.focus();
            $comments.select();
            return;
        }

        // Mostrar loader y deshabilitar botón
        if ($loader) $loader.classList.remove("none");
        const $submitBtn = e.target.querySelector('button[type="submit"]');
        $submitBtn.disabled = true;
        $submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Enviando...';

        // WEB3FORMS - Preparar datos para envío
        const formData = {
            access_key: WEB3FORMS_KEY,
            name: name,
            phone: phone,
            comments: enhancedSanitizeMessage(comments),
            from_name: 'Soluciones Bernal - Portfolio',
            subject: `Nuevo mensaje de ${name}`
        };

        // ENVÍO CON WEB3FORMS
        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(formData)
        })
        .then(async (response) => {
            const json = await response.json();
            if (response.status === 200) {
                // Éxito - Web3Forms retorna {success: true, message: "..."}
                if (json.success) {
                    mostrarModal();
                    $form.reset();
                    if ($charCount) {
                        $charCount.textContent = '0';
                        $charCount.style.color = '#fff';
                    }
                } else {
                    throw new Error(json.message || 'Error en el envío');
                }
            } else {
                throw new Error(json.message || 'Error en la respuesta del servidor');
            }
        })
        .catch(err => {
            console.log(err);
            let message = err.message || "Ocurrió un error al enviar, intenta nuevamente";
            alert(`Error: ${message}`);
        })
        .finally(() => {
            // Ocultar loader y restaurar botón
            if ($loader) $loader.classList.add("none");
            $submitBtn.disabled = false;
            $submitBtn.innerHTML = '<i class="fas fa-paper-plane mr-2"></i>Enviar Mensaje';
        });
    });

    // FUNCIONES GLOBALES PARA EL MODAL
    window.mostrarModal = function() {
        if ($modal) {
            $modal.classList.add('active');
            // No cerrar automáticamente para testing
        }
    };

    window.cerrarModal = function() {
        if ($modal) {
            $modal.classList.remove('active');
        }
    };

    // Función específica para el botón Test
    window.mostrarModalTest = function() {
        if ($modal) {
            $modal.classList.add('active');
        }
    };

    // Cerrar modal haciendo clic fuera
    if ($modal) {
        $modal.addEventListener('click', function(e) {
            if (e.target === this) {
                cerrarModal();
            }
        });
    }

    // También cerrar con la tecla ESC
    d.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && $modal && $modal.classList.contains('active')) {
            cerrarModal();
        }
    });

})(document);


// =====================
// SCROLL SUAVE PARA BOTONES "CONTRATAR"
// =====================
document.addEventListener('DOMContentLoaded', function() {
    const contratarButtons = document.querySelectorAll('a[href="#section-contact"]');
    
    contratarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetSection = document.getElementById('section-contact');
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});